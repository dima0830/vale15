<template>
  <section id="fotos" class="fotos-up-section">
    <div class="fotos-up-card">
      <!-- TÍTULO CON EL ESTILO DE LA IMAGEN DE REFERENCIA -->
      <div class="header-titulo">
        <span class="titulo-cursiva">Comparte tus</span>
        <h2 class="titulo-mayuscula">RECUERDOS</h2>
      </div>

      <p class="section-description">
        En este día tan especial, comparte tus fotografías con nosotros.
        Aparecerán en la pantalla de la fiesta.
      </p>

      <!-- NOMBRE OPCIONAL -->
      <div class="name-field">
        <label for="guest-name" class="name-label">Tu nombre (opcional)</label>
        <input
          id="guest-name"
          v-model="guestName"
          type="text"
          maxlength="80"
          class="name-input"
          placeholder="Así aparecerá junto a tu foto"
        />
      </div>

      <!-- ÁREA INTERACTIVA PARA SUBIR IMÁGENES -->
      <div
        class="dropzone"
        :class="{ 'is-dragging': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden-file-input"
          @change="handleFileSelect"
        />
        <input
          ref="cameraInputRef"
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden-file-input"
          @change="handleFileSelect"
        />

        <div class="dropzone-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="upload-icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p class="dropzone-text">
            Arrastra tus fotos aquí o <span>haz clic para seleccionar</span>
          </p>
          <span class="file-limit">Formatos permitidos: JPG, PNG, WEBP</span>
          <button type="button" class="btn-camera" @click.stop="triggerCamera">
            📷 Tomar foto
          </button>
        </div>
      </div>

      <!-- VISTA PREVIA DE LAS FOTOS SELECCIONADAS -->
      <div v-if="selectedFiles.length" class="preview-container">
        <h3 class="preview-title">
          Fotografías seleccionadas ({{ selectedFiles.length }})
        </h3>
        <div class="preview-grid">
          <div
            v-for="(item, index) in selectedFiles"
            :key="item.preview"
            class="preview-item"
            :class="`is-${item.state}`"
          >
            <img :src="item.preview" :alt="item.name" />
            <span v-if="item.state === 'uploading'" class="preview-badge">…</span>
            <span v-else-if="item.state === 'done'" class="preview-badge">✓</span>
            <span v-else-if="item.state === 'error'" class="preview-badge" :title="item.error">!</span>
            <button
              v-if="!isSubmitting && item.state !== 'done'"
              type="button"
              class="btn-remove"
              title="Quitar foto"
              @click.stop="removeFile(index)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- BOTÓN DE ENVÍO -->
      <div class="actions-group">
        <button
          type="button"
          class="btn-primary"
          :disabled="!pendingCount || isSubmitting"
          @click="enviarFotos"
        >
          <span v-if="isSubmitting">Enviando {{ progressText }}...</span>
          <span v-else>Enviar Fotografías</span>
        </button>
      </div>

      <!-- MENSAJE DE CONFIRMACIÓN O ERROR -->
      <p v-if="statusMessage" class="status-message" :class="statusType">
        {{ statusMessage }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

type UploadState = "ready" | "uploading" | "done" | "error";

interface PreviewFile {
  file: File;
  name: string;
  preview: string;
  state: UploadState;
  error?: string;
}

const NAME_STORAGE_KEY = "vale15_guest_name";
// El proxy (nginx) suele limitar el cuerpo a ~1 MB: comprimimos por debajo.
const TARGET_BYTES = 900 * 1024;

const fileInputRef = ref<HTMLInputElement | null>(null);
const cameraInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<PreviewFile[]>([]);
const guestName = ref("");
const isDragging = ref(false);
const isSubmitting = ref(false);
const uploadedInBatch = ref(0);
const batchSize = ref(0);
const statusMessage = ref("");
const statusType = ref<"success" | "error">("success");

const pendingCount = computed(
  () => selectedFiles.value.filter((f) => f.state === "ready" || f.state === "error").length
);
const progressText = computed(() => `${uploadedInBatch.value + 1}/${batchSize.value}`);

onMounted(() => {
  try {
    guestName.value = localStorage.getItem(NAME_STORAGE_KEY) ?? "";
  } catch {}

  // El QR de la pantalla apunta a /#fotos: bajamos directo a esta sección
  // (esperando a que carguen las imágenes de arriba para no quedar corridos).
  if (location.hash === "#fotos") {
    const scrollHere = () => document.getElementById("fotos")?.scrollIntoView({ block: "start" });
    setTimeout(scrollHere, 300);
    window.addEventListener("load", () => setTimeout(scrollHere, 100), { once: true });
  }
});

onBeforeUnmount(() => {
  selectedFiles.value.forEach((item) => URL.revokeObjectURL(item.preview));
});

function triggerFileInput() {
  fileInputRef.value?.click();
}

function triggerCamera() {
  cameraInputRef.value?.click();
}

function addFiles(files: FileList | File[]) {
  // Al agregar nuevas, limpiamos las que ya se enviaron.
  selectedFiles.value
    .filter((f) => f.state === "done")
    .forEach((f) => URL.revokeObjectURL(f.preview));
  selectedFiles.value = selectedFiles.value.filter((f) => f.state !== "done");

  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name)) {
      selectedFiles.value.push({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
        state: "ready",
      });
    }
  });
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(target.files);
    target.value = "";
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(event.dataTransfer.files);
  }
}

function removeFile(index: number) {
  URL.revokeObjectURL(selectedFiles.value[index].preview);
  selectedFiles.value.splice(index, 1);
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// Redimensiona y comprime en el navegador: subidas rápidas con el wifi del salón.
async function compressImage(file: File) {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // El navegador no pudo decodificarla (p. ej. HEIC): se envía tal cual.
    return { blob: file as Blob, width: null, height: null };
  }

  for (const maxSide of [2048, 1600, 1280]) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.75, 0.65]) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob && blob.size <= TARGET_BYTES) {
        bitmap.close();
        return { blob, width: canvas.width, height: canvas.height };
      }
    }
  }

  bitmap.close();
  throw new Error("La foto es demasiado pesada.");
}

async function uploadOne(item: PreviewFile) {
  const { blob, width, height } = await compressImage(item.file);
  const formData = new FormData();
  formData.append("foto", blob, item.name.replace(/\.\w+$/, "") + ".jpg");
  formData.append("guestName", guestName.value.trim());
  if (width && height) {
    formData.append("width", String(width));
    formData.append("height", String(height));
  }
  await $fetch("/api/photos", { method: "POST", body: formData });
}

async function enviarFotos() {
  const queue = selectedFiles.value.filter((f) => f.state === "ready" || f.state === "error");
  if (!queue.length) return;

  try {
    localStorage.setItem(NAME_STORAGE_KEY, guestName.value.trim());
  } catch {}

  isSubmitting.value = true;
  statusMessage.value = "";
  uploadedInBatch.value = 0;
  batchSize.value = queue.length;
  let failed = 0;

  for (const item of queue) {
    item.state = "uploading";
    try {
      await uploadOne(item);
      item.state = "done";
    } catch (error: any) {
      item.state = "error";
      item.error = error?.data?.statusMessage || error?.message || "Error al subir";
      failed++;
    }
    uploadedInBatch.value++;
  }

  isSubmitting.value = false;
  if (failed) {
    statusType.value = "error";
    statusMessage.value =
      failed === queue.length
        ? "No se pudieron subir las fotos. Inténtalo de nuevo."
        : `${failed} foto(s) no se pudieron subir. Toca "Enviar" para reintentar.`;
  } else {
    statusType.value = "success";
    statusMessage.value = "¡Gracias por compartir tus fotografías! Aparecerán en pantalla en unos minutos.";
    setTimeout(() => (statusMessage.value = ""), 6000);
  }
}
</script>

<style scoped>
/* IMPORTACIÓN DE FUENTE CURSIVA Y SERIF */
@import url("https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&display=swap");

.fotos-up-section {
  width: 100%;
  padding: 2.5rem 1rem;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.fotos-up-card {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(181, 152, 72, 0.2);
  text-align: center;
  box-sizing: border-box;
}

/* ESTILOS DEL TÍTULO SEGÚN LA IMAGEN */
.header-titulo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.titulo-cursiva {
  font-family: "Great Vibes", "Alex Brush", cursive;
  font-size: 2.6rem;
  color: #c49a45; /* Tono dorado elegante */
  line-height: 0.9;
  margin-bottom: -6px; /* Superpone suavemente la palabra */
  text-transform: none;
}

.titulo-mayuscula {
  font-family: "Cinzel", "Playfair Display", "Times New Roman", serif;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3c34; /* Verde esmeralda oscuro */
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.1;
}

.section-description {
  font-size: 0.92rem;
  color: #555555;
  margin-top: 0.8rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

/* ZONA DE CARGA */
.dropzone {
  border: 2px dashed #c49a45;
  border-radius: 14px;
  padding: 1.8rem 1rem;
  background-color: #faf8f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropzone:hover,
.dropzone.is-dragging {
  background-color: #f4efe8;
  border-color: #8c7331;
}

.hidden-file-input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  color: #c49a45;
}

.dropzone-text {
  font-size: 0.9rem;
  color: #444444;
  margin: 0;
}

.dropzone-text span {
  color: #c49a45;
  font-weight: 600;
  text-decoration: underline;
}

.file-limit {
  font-size: 0.75rem;
  color: #888888;
}

/* VISTA PREVIA */
.preview-container {
  margin-top: 1.5rem;
  text-align: left;
}

.preview-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555555;
  margin-bottom: 0.8rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 10px;
}

.preview-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: rgba(220, 38, 38, 0.9);
}

/* BOTONES DE ACCIÓN */
.actions-group {
  display: flex;
  gap: 12px;
  margin-top: 1.8rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #1a3c34; /* Verde esmeralda para el botón principal */
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(26, 60, 52, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: #122c26;
}

.btn-secondary {
  background: transparent;
  color: #c49a45;
  border: 1.5px solid #c49a45;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(196, 154, 69, 0.08);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* NOMBRE */
.name-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
  text-align: left;
}

.name-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a3c34;
}

.name-input {
  height: 42px;
  padding: 0 0.9rem;
  border: 1px solid rgba(196, 154, 69, 0.5);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  background: #faf8f5;
}

.name-input:focus {
  border-color: #1a3c34;
}

.btn-camera {
  margin-top: 0.6rem;
  padding: 0.55rem 1.2rem;
  border-radius: 30px;
  border: 1.5px solid #c49a45;
  background: #ffffff;
  color: #1a3c34;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-camera:hover {
  background: rgba(196, 154, 69, 0.08);
}

.preview-item.is-uploading img {
  opacity: 0.5;
}

.preview-item.is-error {
  outline: 2px solid #d93025;
}

.preview-badge {
  position: absolute;
  inset: auto 4px 4px auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ffffff;
  background: #1a3c34;
}

.preview-item.is-error .preview-badge {
  background: #d93025;
}

.status-message {
  margin-top: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.6rem;
  border-radius: 8px;
}

.status-message.success {
  background-color: #e6f4ea;
  color: #1e7e34;
}

.status-message.error {
  background-color: #fce8e6;
  color: #d93025;
}

@media (max-width: 480px) {
  .actions-group {
    flex-direction: column;
  }
  .titulo-cursiva {
    font-size: 2.2rem;
  }
  .titulo-mayuscula {
    font-size: 1.5rem;
  }
}
</style>
