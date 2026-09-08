<template>
  <div v-if="images.length" class="gallery-carousel" aria-live="polite">
    <div class="gallery-frame-wrapper">
      <!-- MARIPOSAS DECORATIVAS CON LAS IMÁGENES -->
      <img
        src="~/assets/images/mariposa.png"
        alt="Mariposa esmeralda y dorada"
        class="mariposa-img m1"
      />
      <img
        src="~/assets/images/mariposa-.png"
        alt="Mariposa verde perfil"
        class="mariposa-img m2"
      />
      <img
        src="~/assets/images/mariposa.png"
        alt="Mariposa esmeralda y dorada"
        class="mariposa-img m3"
      />
      <img
        src="~/assets/images/mariposa-.png"
        alt="Mariposa verde perfil"
        class="mariposa-img m4"
      />

      <!-- CONTENEDOR DE LA IMAGEN (AMPLIADO) -->
      <div class="gallery-frame">
        <img :src="images[current].src" :alt="images[current].alt" />
      </div>
    </div>

    <!-- CONTROLES (SÓLO PUNTOS) -->
    <div class="gallery-controls">
      <div class="gallery-dots">
        <button
          v-for="(image, index) in images"
          :key="image.src"
          type="button"
          :class="{ active: index === current }"
          :aria-label="`Ver foto ${index + 1}`"
          @click="current = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

interface Image {
  src: string;
  alt: string;
}

interface Props {
  images: Image[];
}

const props = defineProps<Props>();

const current = ref(0);
const total = computed(() => props.images.length);

function next() {
  current.value = current.value === total.value - 1 ? 0 : current.value + 1;
}

// Auto-advance
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  autoplayInterval = setInterval(() => {
    next();
  }, 5000);
});

onBeforeUnmount(() => {
  if (autoplayInterval) clearInterval(autoplayInterval);
});
</script>

<style scoped>
.gallery-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 95%;
  margin: 0 auto;
}

/* CONTENEDOR RELATIVO AMPLIADO */
.gallery-frame-wrapper {
  position: relative;
  width: 100%;
  max-width: 340px; /* Recuadro más grande */
  margin: 0 auto;
}

/* MARCO Y IMAGEN DE MAYOR TAMAÑO CON BORDES REDONDEADOS */
.gallery-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  background: #f4efe8;
}

.gallery-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.5s ease;
}

/* ESTILOS Y POSICIONAMIENTO DE LAS MARIPOSAS */
.mariposa-img {
  position: absolute;
  height: auto;
  z-index: 3;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  animation: aleteo 3.5s ease-in-out infinite alternate;
}

/* Posiciones y tamaños individuales */
.m1 {
  width: 55px;
  top: -20px;
  left: -15px;
  transform: rotate(-12deg);
  animation-delay: 0s;
}

.m2 {
  width: 42px;
  top: 10px;
  right: -18px;
  transform: rotate(15deg);
  animation-delay: 0.8s;
}

.m3 {
  width: 48px;
  bottom: -15px;
  left: 10px;
  transform: rotate(-25deg);
  animation-delay: 1.5s;
}

.m4 {
  width: 38px;
  bottom: 15px;
  right: -12px;
  transform: rotate(5deg);
  animation-delay: 2.2s;
}

/* Animación de flotación suave */
@keyframes aleteo {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  100% {
    transform: translateY(-6px) rotate(6deg) scale(1.04);
  }
}

/* PUNTOS DE NAVEGACIÓN CENTRADOS */
.gallery-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.gallery-dots {
  display: flex;
  gap: 0.6rem;
}

.gallery-dots button {
  width: 0.55rem;
  height: 0.55rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(181, 152, 72, 0.35);
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-dots button.active {
  background: #b59848;
  transform: scale(1.5);
}
</style>
