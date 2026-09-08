<template>
  <div class="photo-upload">
    <div
      class="upload-area"
      @drop="handleDrop"
      @dragover.prevent
      @dragleave="isDragging = false"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        accept="image/*"
        multiple
        style="display: none"
      />

      <button class="upload-btn" @click="triggerFileInput">
        <span>Subir foto</span>
      </button>

      <p class="upload-text">O arrastra tu foto aquí</p>
    </div>

    <button
      class="view-photos-btn"
      @click="showPhotos"
      :disabled="!canViewPhotos"
    >
      Ver fotos subidas
    </button>

    <div v-if="uploadedPhotos.length > 0" class="photos-preview">
      <p class="preview-count">
        {{ uploadedPhotos.length }} foto{{
          uploadedPhotos.length !== 1 ? "s" : ""
        }}
        subida{{ uploadedPhotos.length !== 1 ? "s" : "" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits<{
  photoUploaded: [file: File];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedPhotos = ref<File[]>([]);
const isDragging = ref(false);

// Fecha del evento
const eventDate = new Date("2026-09-26");
const now = new Date();
const canViewPhotos = computed(() => now >= eventDate);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files?.length) {
    for (const file of files) {
      uploadedPhotos.value.push(file);
      emit("photoUploaded", file);
    }
  }

  // Reset input
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer?.files;

  if (files?.length) {
    for (const file of files) {
      uploadedPhotos.value.push(file);
      emit("photoUploaded", file);
    }
  }
}

// 👉 ESTA FUNCIÓN ESTABA MAL UBICADA
function showPhotos() {
  if (uploadedPhotos.value.length > 0) {
    alert(
      `Se han subido ${uploadedPhotos.value.length} fotos. En producción, aquí se mostrarían en una galería.`,
    );
  }
}
</script>

<style scoped>
.photo-upload {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}
.upload-area {
  border: 1px dashed rgba(247, 244, 237, 0.48);
  padding: 1.4rem;
  text-align: center;
}
.upload-btn,
.view-photos-btn {
  padding: 0.8rem 1rem;
  border: 1px solid rgba(247, 244, 237, 0.5);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.upload-btn {
  background: #f7f4ed;
  color: #536052;
  border-color: #f7f4ed;
}
.upload-text,
.preview-count {
  margin: 0.7rem 0 0;
  color: rgba(247, 244, 237, 0.65);
  font-size: 0.75rem;
}
.view-photos-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
