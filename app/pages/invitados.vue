<template>
  <section class="invitados-page">
    <div class="invitados-card">
      <h1 class="page-title">Lista de invitados</h1>

      <!-- FORMULARIO DE ACCESO -->
      <form v-if="!authenticated" class="login-form" @submit.prevent="login">
        <label for="admin-password" class="field-label">Contraseña</label>
        <input
          id="admin-password"
          v-model="password"
          type="password"
          class="field-input"
          placeholder="Ingresa la contraseña"
          autofocus
        />
        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? "Verificando..." : "Ingresar" }}
        </button>
        <p v-if="loginError" class="error-text">{{ loginError }}</p>
      </form>

      <!-- LISTADO -->
      <div v-else class="listing">
        <div class="listing-header">
          <p class="summary">
            {{ rows.length }} registro{{ rows.length === 1 ? "" : "s" }}
            · {{ totalAttending }} asistirán · {{ totalPasses }} pases en total
          </p>
          <div class="listing-actions">
            <button class="btn-secondary" type="button" :disabled="loading" @click="fetchList">
              {{ loading ? "Actualizando..." : "Actualizar" }}
            </button>
            <button class="btn-secondary" type="button" @click="logout">Salir</button>
          </div>
        </div>

        <p v-if="listError" class="error-text">{{ listError }}</p>

        <div class="table-wrapper">
          <table v-if="rows.length" class="rsvp-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Asistencia</th>
                <th>Pases</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.full_name }}</td>
                <td>{{ row.phone || "—" }}</td>
                <td>
                  <span
                    class="badge"
                    :class="row.attendance === 'Acepto con mucho gusto' ? 'badge-yes' : 'badge-no'"
                  >
                    {{ row.attendance === "Acepto con mucho gusto" ? "Asiste" : "No asiste" }}
                  </span>
                </td>
                <td>{{ row.passes_count }}</td>
                <td>{{ formatDate(row.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else-if="!loading" class="empty-text">Aún no hay registros.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "default",
});

useHead({
  title: "Invitados",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

interface Rsvp {
  id: number;
  full_name: string;
  phone: string | null;
  attendance: string;
  passes_count: number;
  created_at: string;
}

const authenticated = ref(false);
const password = ref("");
const loading = ref(false);
const loginError = ref("");
const listError = ref("");
const rows = ref<Rsvp[]>([]);

const totalAttending = computed(
  () => rows.value.filter((r) => r.attendance === "Acepto con mucho gusto").length
);
const totalPasses = computed(() =>
  rows.value
    .filter((r) => r.attendance === "Acepto con mucho gusto")
    .reduce((sum, r) => sum + r.passes_count, 0)
);

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function fetchList() {
  loading.value = true;
  listError.value = "";
  try {
    const res = await $fetch<{ ok: true; rows: Rsvp[] }>("/api/invitados/list");
    rows.value = res.rows;
    authenticated.value = true;
  } catch (error: any) {
    if (error?.statusCode === 401) {
      authenticated.value = false;
    } else {
      listError.value = "No se pudo cargar la lista.";
    }
  } finally {
    loading.value = false;
  }
}

async function login() {
  if (!password.value) return;
  loading.value = true;
  loginError.value = "";
  try {
    await $fetch("/api/invitados/login", {
      method: "POST",
      body: { password: password.value },
    });
    password.value = "";
    await fetchList();
  } catch (error: any) {
    loginError.value = error?.statusCode === 401 ? "Contraseña incorrecta." : "Ocurrió un error.";
  } finally {
    loading.value = false;
  }
}

async function logout() {
  await $fetch("/api/invitados/logout", { method: "POST" }).catch(() => {});
  authenticated.value = false;
  rows.value = [];
}

onMounted(fetchList);
</script>

<style scoped>
.invitados-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  background-color: #f3f9f1;
  color: #1c4b3c;
  box-sizing: border-box;
}

.invitados-card {
  width: 100%;
  max-width: 720px;
}

.page-title {
  font-family: "Cinzel", serif;
  font-size: 1.6rem;
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 320px;
}

.field-label {
  font-size: 13px;
  font-weight: 600;
}

.field-input {
  height: 42px;
  padding: 8px 12px;
  border: 1px solid #d4c59a;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.field-input:focus {
  border-color: #1c4b3c;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  font-family: "Cinzel", serif;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary {
  background-color: #235848;
  color: #fff;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e2ede0;
  color: #1c4b3c;
}

.error-text {
  color: #d9534f;
  font-size: 13px;
}

.listing-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.summary {
  font-size: 14px;
}

.listing-actions {
  display: flex;
  gap: 8px;
}

.table-wrapper {
  overflow-x: auto;
}

.rsvp-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
}

.rsvp-table th,
.rsvp-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e2ede0;
  white-space: nowrap;
}

.rsvp-table th {
  background-color: #e2ede0;
  font-family: "Cinzel", serif;
  font-size: 12px;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-yes {
  background-color: #cce0c9;
  color: #1c4b3c;
}

.badge-no {
  background-color: #f3d9d9;
  color: #7a2e2e;
}

.empty-text {
  font-size: 14px;
  opacity: 0.7;
}
</style>
