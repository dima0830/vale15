<template>
  <div class="moderation">
    <div class="moderation-header">
      <div class="filters">
        <button
          v-for="f in FILTERS"
          :key="f.value"
          type="button"
          class="filter"
          :class="{ active: filter === f.value }"
          @click="filter = f.value"
        >
          {{ f.label }} <span class="filter-count">{{ counts[f.value] }}</span>
        </button>
      </div>
      <div class="moderation-actions">
        <button
          v-if="filter === 'pending' && visible.length"
          type="button"
          class="btn-primary"
          :disabled="busy"
          @click="approveAll"
        >
          Aprobar todas ({{ visible.length }})
        </button>
        <button type="button" class="btn-secondary" :disabled="loading" @click="fetchPhotos">
          {{ loading ? "Actualizando..." : "Actualizar" }}
        </button>
        <a href="/pantalla" target="_blank" class="btn-secondary link-btn">Abrir pantalla ↗</a>
      </div>
    </div>

    <p class="hint">Se actualiza automáticamente cada {{ REFRESH_SECONDS }} s. Solo las aprobadas salen en la pantalla.</p>
    <p v-if="error" class="error-text">{{ error }}</p>

    <div v-if="visible.length" class="photo-grid">
      <article v-for="photo in visible" :key="photo.id" class="photo-card" :class="`is-${photo.status}`">
        <button type="button" class="photo-thumb" @click="preview = photo">
          <img :src="photo.url" :alt="photo.guestName || 'Foto de invitado'" loading="lazy" />
          <span class="status-pill">{{ STATUS_LABEL[photo.status] }}</span>
        </button>
        <div class="photo-meta">
          <strong>{{ photo.guestName || "Anónimo" }}</strong>
          <span>{{ formatTime(photo.createdAt) }}</span>
        </div>
        <div class="photo-actions">
          <button
            v-if="photo.status !== 'approved'"
            type="button"
            class="act approve"
            :disabled="busy"
            @click="setStatus(photo, 'approved')"
          >
            ✓ Aprobar
          </button>
          <button
            v-if="photo.status !== 'rejected'"
            type="button"
            class="act reject"
            :disabled="busy"
            @click="setStatus(photo, 'rejected')"
          >
            ✕ Rechazar
          </button>
          <button type="button" class="act delete" :disabled="busy" title="Eliminar definitivamente" @click="remove(photo)">
            🗑
          </button>
        </div>
      </article>
    </div>
    <p v-else-if="!loading" class="empty-text">No hay fotos {{ EMPTY_LABEL[filter] }}.</p>

    <!-- VISTA AMPLIADA -->
    <div v-if="preview" class="lightbox" @click="preview = null">
      <img :src="preview.url" :alt="preview.guestName || 'Foto de invitado'" />
      <div class="lightbox-actions" @click.stop>
        <button
          v-if="preview.status !== 'approved'"
          type="button"
          class="act approve"
          @click="setStatus(preview, 'approved'); preview = null"
        >
          ✓ Aprobar
        </button>
        <button
          v-if="preview.status !== 'rejected'"
          type="button"
          class="act reject"
          @click="setStatus(preview, 'rejected'); preview = null"
        >
          ✕ Rechazar
        </button>
        <button type="button" class="act" @click="preview = null">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

type Status = "pending" | "approved" | "rejected";
type Filter = Status | "all";

interface Photo {
  id: number;
  url: string;
  guestName: string | null;
  status: Status;
  createdAt: string;
}

const emit = defineEmits<{
  (e: "pending-count", value: number): void;
  (e: "unauthorized"): void;
}>();

const REFRESH_SECONDS = 10;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
  { value: "all", label: "Todas" },
];
const STATUS_LABEL: Record<Status, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};
const EMPTY_LABEL: Record<Filter, string> = {
  pending: "pendientes",
  approved: "aprobadas",
  rejected: "rechazadas",
  all: "todavía",
};

const photos = ref<Photo[]>([]);
const filter = ref<Filter>("pending");
const loading = ref(false);
const busy = ref(false);
const error = ref("");
const preview = ref<Photo | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;

const counts = computed(() => {
  const c: Record<Filter, number> = { pending: 0, approved: 0, rejected: 0, all: photos.value.length };
  photos.value.forEach((p) => c[p.status]++);
  return c;
});

const visible = computed(() =>
  filter.value === "all" ? photos.value : photos.value.filter((p) => p.status === filter.value)
);

watch(() => counts.value.pending, (n) => emit("pending-count", n), { immediate: true });

function formatTime(value: string) {
  return new Date(value).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

function handleError(err: any, message: string) {
  if (err?.statusCode === 401) {
    emit("unauthorized");
  } else {
    error.value = message;
  }
}

async function fetchPhotos() {
  if (busy.value) return;
  loading.value = true;
  try {
    const res = await $fetch<{ ok: true; photos: Photo[] }>("/api/invitados/photos");
    photos.value = res.photos;
    error.value = "";
  } catch (err) {
    handleError(err, "No se pudieron cargar las fotos.");
  } finally {
    loading.value = false;
  }
}

async function setStatus(photo: Photo, status: Status) {
  const previous = photo.status;
  photo.status = status;
  try {
    await $fetch(`/api/invitados/photos/${photo.id}`, { method: "PATCH", body: { status } });
  } catch (err) {
    photo.status = previous;
    handleError(err, "No se pudo actualizar la foto.");
  }
}

async function approveAll() {
  busy.value = true;
  try {
    for (const photo of [...visible.value]) {
      await setStatus(photo, "approved");
    }
  } finally {
    busy.value = false;
  }
}

async function remove(photo: Photo) {
  if (!confirm("¿Eliminar esta foto definitivamente?")) return;
  try {
    await $fetch(`/api/invitados/photos/${photo.id}`, { method: "DELETE" });
    photos.value = photos.value.filter((p) => p.id !== photo.id);
  } catch (err) {
    handleError(err, "No se pudo eliminar la foto.");
  }
}

onMounted(() => {
  fetchPhotos();
  timer = setInterval(fetchPhotos, REFRESH_SECONDS * 1000);
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.moderation-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.filters,
.moderation-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.filter {
  border: 1px solid #d4c59a;
  background: #fff;
  color: #1c4b3c;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
}

.filter.active {
  background: #235848;
  border-color: #235848;
  color: #fff;
}

.filter-count {
  opacity: 0.75;
  margin-left: 2px;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-family: "Cinzel", serif;
  font-size: 13px;
  cursor: pointer;
}

.btn-primary {
  background-color: #c49a45;
  color: #fff;
}

.btn-secondary {
  background-color: #e2ede0;
  color: #1c4b3c;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link-btn {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.hint {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 14px;
}

.error-text {
  color: #d9534f;
  font-size: 13px;
  margin-bottom: 10px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
}

.photo-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(28, 75, 60, 0.08);
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.photo-card.is-approved {
  border-color: #8fbf8a;
}

.photo-card.is-rejected {
  opacity: 0.6;
}

.photo-thumb {
  position: relative;
  padding: 0;
  border: none;
  background: #e2ede0;
  aspect-ratio: 1 / 1;
  cursor: zoom-in;
}

.photo-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.status-pill {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  color: #1c4b3c;
}

.is-pending .status-pill {
  background: #c49a45;
  color: #fff;
}

.photo-meta {
  padding: 8px 10px 4px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 2px;
}

.photo-meta span {
  font-size: 11px;
  opacity: 0.65;
}

.photo-actions {
  display: flex;
  gap: 4px;
  padding: 6px 8px 10px;
}

.act {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 7px 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: #eef3ec;
  color: #1c4b3c;
}

.act:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.act.approve {
  background: #235848;
  color: #fff;
}

.act.reject {
  background: #f3d9d9;
  color: #7a2e2e;
}

.act.delete {
  flex: 0 0 34px;
}

.empty-text {
  font-size: 14px;
  opacity: 0.7;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(10, 25, 20, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.lightbox img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  object-fit: contain;
}

.lightbox-actions {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 360px;
}
</style>
