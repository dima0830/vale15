<template>
  <section class="fotos-up-section">
    <div class="fotos-up-card">
      <!-- TÍTULO CON EL ESTILO DE LA IMAGEN DE REFERENCIA -->
      <div class="header-titulo">
        <span class="titulo-cursiva">Comparte tus</span>
        <h2 class="titulo-mayuscula">RECUERDOS</h2>
      </div>

      <p class="section-description">
        En este día tan especial, comparte tus fotografías con nosotros.
      </p>

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
        </div>
      </div>

      <!-- VISTA PREVIA DE LAS FOTOS SELECCIONADAS -->
      <div v-if="selectedFiles.length" class="preview-container">
        <h3 class="preview-title">
          Fotografías seleccionadas ({{ selectedFiles.length }})
        </h3>
        <div class="preview-grid">
          <div
            v-for="(file, index) in selectedFiles"
            :key="file.name + index"
            class="preview-item"
          >
            <img :src="file.preview" :alt="file.name" />
            <button
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

      <!-- BOTONES DE ACCIÓN: GUARDAR Y ENVIAR -->
      <div class="actions-group">
        <button
          type="button"
          class="btn-secondary"
          :disabled="!selectedFiles.length || isSubmitting"
          @click="guardarBorrador"
        >
          Guardar
        </button>
        <button
          type="button"
          class="btn-primary"
          :disabled="!selectedFiles.length || isSubmitting"
          @click="enviarFotos"
        >
          <span v-if="isSubmitting">Enviando...</span>
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
import { ref } from "vue";

interface PreviewFile {
  file: File;
  name: string;
  preview: string;
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<PreviewFile[]>([]);
const isDragging = ref(false);
const isSubmitting = ref(false);
const statusMessage = ref("");
const statusType = ref<"success" | "error">("success");

function triggerFileInput() {
  fileInputRef.value?.click();
}

function addFiles(files: FileList | File[]) {
  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      selectedFiles.value.push({
        file,
        name: file.name,
        preview,
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

function guardarBorrador() {
  statusType.value = "success";
  statusMessage.value = "Tus fotos se guardaron temporalmente.";
  setTimeout(() => (statusMessage.value = ""), 4000);
}

async function enviarFotos() {
  if (!selectedFiles.value.length) return;

  isSubmitting.value = true;
  statusMessage.value = "";

  try {
    const formData = new FormData();
    selectedFiles.value.forEach((item, index) => {
      formData.append(`fotos[${index}]`, item.file);
    });

    // Simulación del envío al servidor
    await new Promise((resolve) => setTimeout(resolve, 1500));

    statusType.value = "success";
    statusMessage.value = "¡Gracias por compartir tus fotografías!";

    selectedFiles.value.forEach((item) => URL.revokeObjectURL(item.preview));
    selectedFiles.value = [];
  } catch (error) {
    statusType.value = "error";
    statusMessage.value = "Error al subir las imágenes. Inténtalo de nuevo.";
  } finally {
    isSubmitting.value = false;
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
