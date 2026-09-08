<template>
  <section
    id="inicio"
    ref="sectionRef"
    class="hero-section"
    :class="{ 'is-visible': isVisible }"
  >
    <img
      src="~/assets/images/principal.png"
      alt="Fondo Los Novios"
      class="hero-image"
    />

    <div class="hero-content">
      <img
        src="~/assets/images/nombre-vale.png"
        alt="Sobre cerrado"
        class="hero-nombre"
      />

      <div class="sobre-wrapper">
        <!-- SOBRE CERRADO -->
        <div v-if="!estaAbierto" class="hero-sobre-cerrado" @click="abrirSobre">
          <img
            src="~/assets/images/sobre1.png"
            alt="Sobre cerrado"
            class="hero-sobre-base"
          />

          <!-- SELLO CON ANIMACIÓN DE PULSO Y ZOOM -->
          <img
            src="~/assets/images/sello.png"
            alt="Sello de cera V"
            class="sello-interactivo"
          />

          <p class="instruccion-abrir">TOCA PARA ABRIR EL SOBRE</p>
        </div>

        <!-- SOBRE ABIERTO -->
        <div v-else class="hero-sobre-abierto">
          <img
            src="~/assets/images/sobre2.png"
            alt="Fondo sobre"
            class="hero-sobre-base capa-fondo-sobre"
          />
          <img
            src="~/assets/images/marco.png"
            alt="Marco foto"
            class="capa-elemento sobre-foto animar-subida-foto"
          />
          <img
            src="~/assets/images/papel.png"
            alt="Tarjeta V"
            class="capa-elemento sobre-papel animar-subida-papel"
          />
          <img
            src="~/assets/images/sobre3.png"
            alt="Frente del sobre"
            class="hero-sobre-base capa-frente-sobre"
          />
        </div>
      </div>

      <img
        src="~/assets/images/date.png"
        alt="Sobre cerrado"
        class="hero-date"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const estaAbierto = ref(false);
const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

function abrirSobre() {
  estaAbierto.value = true;
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        if (observer && sectionRef.value) {
          observer.unobserve(sectionRef.value);
        }
      }
    },
    { threshold: 0.2 },
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 16px;
  box-sizing: border-box;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1),
    transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 360px;
  height: 85%;
  margin: 0 auto;
}

.hero-nombre {
  width: 60%;
  height: auto;
  display: block;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.3s,
    transform 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.3s;
}

.sobre-wrapper {
  position: relative;
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1.5 / 1;
  margin: auto 0;
  opacity: 0;
  transform: translateY(25px) scale(0.95);
  transition:
    opacity 1s cubic-bezier(0.25, 1, 0.5, 1) 0.5s,
    transform 1s cubic-bezier(0.25, 1, 0.5, 1) 0.5s;
}

.hero-date {
  width: 60%;
  height: auto;
  display: block;
  margin-top: 36px;
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.7s,
    transform 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.7s;
}

/* =========================================
   ESTADOS DE VISIBILIDAD (AL HACER SCROLL)
   ========================================= */
.is-visible .hero-image {
  opacity: 1;
  transform: scale(1);
}

.is-visible .hero-nombre,
.is-visible .hero-date {
  opacity: 1;
  transform: translateY(0);
}

.is-visible .sobre-wrapper {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* SOBRE & ELEMENTOS INTERNOS */
.hero-sobre-base {
  width: 100%;
  height: auto;
  display: block;
}

.hero-sobre-cerrado {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease;
}

.hero-sobre-cerrado:hover {
  transform: scale(1.02);
}

.sello-interactivo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65px;
  height: auto;
  z-index: 5;
  animation: latidoSello 2.2s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));
}

.instruccion-abrir {
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  color: #ffffff;
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  margin: 0;
}

.hero-sobre-abierto {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.capa-fondo-sobre {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.capa-elemento {
  position: absolute;
  z-index: 20;
  bottom: 0px;
}

.sobre-foto {
  width: 70%;
  left: 3%;
  bottom: 4px;
}

.sobre-papel {
  width: 80%;
  right: 0%;
  bottom: -40px;
}

.capa-frente-sobre {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 30;
  pointer-events: none;
}

/* ANIMACIONES INTERNAS DEL SOBRE */
.animar-subida-foto {
  animation: emergerFoto 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.animar-subida-papel {
  animation: emergerPapel 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.12s forwards;
  opacity: 0;
}

@keyframes emergerFoto {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(-80px) scale(1);
  }
}

@keyframes emergerPapel {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(-75px) scale(1);
  }
}

@keyframes latidoSello {
  0% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
  30% {
    transform: translate(-50%, -50%) scale(1.12) rotate(-3deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05) rotate(2deg);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.15) rotate(-1deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
  }
}

@media (max-height: 660px) {
  .sobre-wrapper {
    max-width: 240px;
  }
  .sello-interactivo {
    width: 55px;
  }
}
</style>
