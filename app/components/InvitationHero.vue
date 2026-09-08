<template>
  <section id="inicio" class="hero-section">
    <!-- PANTALLA DE INICIO CON FONDO, TÍTULO, SOBRE VERDE, FECHA Y SELLO INTERACTIVO -->
    <div v-if="!iniciado" class="pantalla-inicio" @click="iniciarExperiencia">
      <img
        src="~/assets/images/principal.png"
        alt="Fondo Principal"
        class="fondo-inicio"
      />

      <!-- CONTENEDOR PRINCIPAL VERTICAL -->
      <div class="hero-contenido">
        <!-- TÍTULO ARRIBA DEL SOBRE -->
        <img
          src="~/assets/images/nombre-vale.png"
          alt="Los Quince Años de Vale"
          class="titulo-vale"
        />

        <!-- CONTENEDOR DEL SOBRE -->
        <div class="sobre-wrapper">
          <!-- SOBRE VERDE CON RELIEVES -->
          <img
            src="~/assets/images/sobre1.png"
            alt="Sobre verde de invitación"
            class="hero-sobre-base"
          />

          <!-- SELLO INTERACTIVO SOBRE EL SELLO DEL SOBRE -->
          <img
            src="~/assets/images/sello.png"
            alt="Sello de cera V"
            class="sello-interactivo"
          />
        </div>

        <!-- INSTRUCCIÓN DE APERTURA -->
        <p class="instruccion-abrir">TOCA PARA ABRIR EL SOBRE</p>

        <!-- FECHA ABAJO DEL SOBRE -->
        <img
          src="~/assets/images/date.png"
          alt="26 | 09 | 26"
          class="fecha-evento"
        />
      </div>
    </div>

    <!-- REPRODUCTOR DE VIDEO Y FLECHA DE DESPLAZAMIENTO -->
    <template v-else>
      <video
        ref="videoRef"
        autoplay
        playsinline
        class="hero-video"
        @ended="videoFinalizado = true"
      >
        <source src="~/assets/videos/videoH.mp4" type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>

      <!-- INDICADOR DESLIZA ABAJO (Se muestra solo cuando termina el video) -->
      <div v-if="videoFinalizado" class="indicador-scroll">
        <p class="texto-desliza">DESLIZA ABAJO</p>
        <div class="flecha-saltarina">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const iniciado = ref(false);
const videoFinalizado = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);

async function iniciarExperiencia() {
  iniciado.value = true;
  videoFinalizado.value = false;

  await nextTick();

  if (videoRef.value) {
    videoRef.value.muted = false;
    videoRef.value.play().catch((error) => {
      console.error("Error al reproducir el video:", error);
    });
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background-color: #000000;
}

/* PANTALLA DE INICIO */
.pantalla-inicio {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  box-sizing: border-box;
}

.fondo-inicio {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* CONTENEDOR VERTICAL APILADO */
.hero-contenido {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 380px;
  gap: 1rem;
}

/* TÍTULO ARRIBA */
.titulo-vale {
  width: 80%;
  max-width: 260px;
  height: auto;
  display: block;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

/* CONTENEDOR DEL SOBRE */
.sobre-wrapper {
  position: relative;
  width: 90%;
  max-width: 320px;
  aspect-ratio: 1.35 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.pantalla-inicio:hover .sobre-wrapper {
  transform: scale(1.03);
}

.hero-sobre-base {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 4px;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6));
}

.sello-interactivo {
  position: absolute;
  top: 51.5%;
  left: 50%;
  width: 54px;
  height: auto;
  z-index: 5;
  animation: latidoZoomSello 2.2s ease-in-out infinite;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
}

/* FECHA ABAJO */
.fecha-evento {
  width: 65%;
  max-width: 220px;
  height: auto;
  display: block;
  margin-top: 0.2rem;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.5));
}

/* INSTRUCCIÓN */
.instruccion-abrir {
  text-align: center;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* REPRODUCTOR DE VIDEO */
.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* INDICADOR FLECHA DESLIZAR ABAJO */
.indicador-scroll {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #ffffff;
  pointer-events: none;
  animation: fadeIn 0.8s ease-out forwards;
}

.texto-desliza {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.flecha-saltarina {
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
  animation: rebotar 1.8s infinite;
}

/* ANIMACIONES */
@keyframes latidoZoomSello {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  30% {
    transform: translate(-50%, -50%) scale(1.18);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.06);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.22);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes rebotar {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-12px);
  }
  60% {
    transform: translateY(-6px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@media (max-height: 660px) {
  .hero-contenido {
    gap: 0.5rem;
  }
  .titulo-vale {
    max-width: 200px;
  }
  .sobre-wrapper {
    max-width: 240px;
  }
  .sello-interactivo {
    width: 42px;
  }
  .fecha-evento {
    max-width: 170px;
  }
}
</style>
