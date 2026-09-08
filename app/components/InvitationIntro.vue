<template>
  <section
    ref="sectionRef"
    class="presentacion-section"
    :class="{ 'is-visible': isVisible }"
  >
    <!-- DECORACIÓN SUPERIOR -->
    <img
      src="~/assets/images/mariposa.png"
      alt="Mariposa decorativa"
      class="deco mariposa-top-left animar-mariposa-1"
    />
    <img
      src="~/assets/images/mariposa-.png"
      alt="Mariposa pequeña"
      class="deco mariposa-top-right animar-mariposa-2"
    />

    <!-- MARCO PRINCIPAL -->
    <div class="marco-container animar-marco">
      <img
        src="~/assets/images/marco.png"
        alt="Foto Quinceañera"
        class="marco-img"
      />
    </div>

    <!-- SECCIÓN INFERIOR: TIANA Y TEXTO -->
    <div class="inferior-container">
      <img
        src="~/assets/images/tiana.png"
        alt="Princesa Tiana"
        class="tiana-img animar-tiana"
      />

      <div class="texto-container animar-texto">
        <p class="mensaje">
          Dicen que si le pides un deseo a la estrella más brillante, con el
          corazón y trabajo duro, los sueños se hacen realidad. Hoy celebro el
          inicio de los míos. ¡Acompáñame a festejar mis 15 años!
        </p>
      </div>

      <!-- DECORACIÓN INFERIOR -->
      <img
        src="~/assets/images/mariposa.png"
        alt="Mariposa decorativa"
        class="deco mariposa-bottom-right animar-mariposa-3"
      />
    </div>

    <!-- MARIPOSA CENTRO ABAJO -->
    <img
      src="~/assets/images/mariposa.png"
      alt="Mariposa decorativa"
      class="deco mariposa-bottom-center animar-mariposa-4"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        if (observer && sectionRef.value) {
          observer.unobserve(sectionRef.value); // Se ejecuta una sola vez al hacer scroll
        }
      }
    },
    { threshold: 0.25 }, // Se activa cuando el 25% de la sección entra en pantalla
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
/* CONTENEDOR PRINCIPAL */
.presentacion-section {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* MARCO CENTRAL */
.marco-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;
  margin-top: 20px;
}

.marco-img {
  width: 85%;
  max-width: 320px;
  height: auto;
}

/* SECCIÓN INFERIOR (TIANA + TEXTO) */
.inferior-container {
  position: relative;
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  gap: 4%;
  min-height: 200px;
  z-index: 3;
}

/* TIANA (ancho fluido, sin solaparse con el texto) */
.tiana-img {
  flex: 0 0 auto;
  width: clamp(105px, 34vw, 160px);
  height: auto;
  z-index: 5;
}

/* TEXTO */
.texto-container {
  flex: 1 1 auto;
  min-width: 0;
  margin-bottom: 10px;
  z-index: 4;
}

.mensaje {
  font-family: "Cormorant", serif;
  color: #235848;
  font-size: clamp(0.95rem, 4vw, 1.125rem);
  line-height: 1.45;
  text-align: left;
  font-weight: 500;
  margin: 0;
}

/* MARIPOSAS */
.deco {
  position: absolute;
  z-index: 6;
  pointer-events: none;
}

.mariposa-top-left {
  top: 30px;
  left: 20px;
  width: 80px;
}

.mariposa-top-right {
  top: 60px;
  right: 30px;
  width: 40px;
}

.mariposa-bottom-right {
  bottom: -15px;
  right: 15px;
  width: 55px;
}

.mariposa-bottom-center {
  bottom: 10px;
  left: 45%;
  width: 65px;
}

/* =========================================
   ESTADOS INICIALES (ANTES DE HACER SCROLL)
   ========================================= */
.animar-marco,
.animar-tiana,
.animar-texto,
.animar-mariposa-1,
.animar-mariposa-2,
.animar-mariposa-3,
.animar-mariposa-4 {
  opacity: 0;
  transition:
    opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
}

.animar-marco {
  transform: translateY(30px) scale(0.95);
}

.animar-tiana {
  transform: translateX(-40px);
}

.animar-texto {
  transform: translateX(30px);
}

.animar-mariposa-1 {
  transform: rotate(-15deg) scale(0.5);
}

.animar-mariposa-2 {
  transform: rotate(15deg) scale(0.5);
}

.animar-mariposa-3 {
  transform: rotate(-10deg) scale(0.5);
}

.animar-mariposa-4 {
  transform: translateX(-50%) rotate(5deg) scale(0.5);
}

/* =========================================
   ESTADOS ACTIVOS (CUANDO ES VISIBLE EN PANTALLA)
   ========================================= */

/* 1. Entra el Marco de la Foto */
.is-visible .animar-marco {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 0.1s;
}

/* 2. Entra Princesa Tiana desde la izquierda */
.is-visible .animar-tiana {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.3s;
}

/* 3. Entra el texto poético desde la derecha */
.is-visible .animar-texto {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.5s;
}

/* 4. Entran y aletean las mariposas (escalonadas) */
.is-visible .animar-mariposa-1 {
  opacity: 1;
  transform: rotate(-15deg) scale(1);
  transition-delay: 0.6s;
  animation: aleteoSuave 3s ease-in-out infinite alternate 1.4s;
}

.is-visible .animar-mariposa-2 {
  opacity: 1;
  transform: rotate(15deg) scale(1);
  transition-delay: 0.7s;
  animation: aleteoSuave 3.5s ease-in-out infinite alternate 1.5s;
}

.is-visible .animar-mariposa-3 {
  opacity: 1;
  transform: rotate(-10deg) scale(1);
  transition-delay: 0.8s;
  animation: aleteoSuave 2.8s ease-in-out infinite alternate 1.6s;
}

.is-visible .animar-mariposa-4 {
  opacity: 1;
  transform: translateX(-50%) rotate(5deg) scale(1);
  transition-delay: 0.9s;
  animation: aleteoSuave 3.2s ease-in-out infinite alternate 1.7s;
}

/* Animación sutil de aleteo/flotación continuo para las mariposas */
@keyframes aleteoSuave {
  0% {
    transform: translateY(0px) rotate(-5deg);
  }
  100% {
    transform: translateY(-8px) rotate(5deg);
  }
}

/* Ajustes responsive */
@media (max-width: 360px) {
  .inferior-container {
    gap: 3%;
  }
}
</style>
