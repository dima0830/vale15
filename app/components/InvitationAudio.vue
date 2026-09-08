<template>
  <section class="audio-section">
    <div class="audio-card">
      <!-- PERSONAJE IZQUIERDA (LUCIÉRNAGA) -->
      <img
        src="~/assets/images/luci.png"
        alt="Luciérnaga"
        class="ilustracion ray"
      />

      <!-- CONTENIDO CENTRAL -->
      <div class="audio-content">
        <h2 class="audio-title">LA MAGIA EMPIEZA<br />CON UNA CANCIÓN...</h2>

        <!-- CONTROLES DE REPRODUCCIÓN -->
        <div class="player-controls">
          <span class="decoracion-flor">✿</span>

          <button class="btn-step" aria-label="Anterior">
            <span>&#10094;&#10094;</span>
          </button>

          <button
            class="btn-play"
            :aria-label="isPlayingAudio ? 'Pausar' : 'Reproducir'"
            @click="toggleAudio"
          >
            <span v-if="!isPlayingAudio" class="icon-play">▶</span>
            <span v-else class="icon-pause">❚❚</span>
          </button>

          <button class="btn-step" aria-label="Siguiente">
            <span>&#10095;&#10095;</span>
          </button>

          <span class="decoracion-flor">✿</span>
        </div>

        <!-- BARRA DE PROGRESO -->
        <div class="progress-container">
          <div
            class="progress-bar"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- PERSONAJE DERECHA (MARIPOSA) -->
      <img
        src="~/assets/images/mariposa.png"
        alt="Mariposa"
        class="ilustracion mariposa"
      />

      <audio
        ref="audioRef"
        :src="songUrl"
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
      ></audio>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import songUrl from "~/assets/audio/song.mp3";

const audioRef = ref<HTMLAudioElement | null>(null);
const isPlayingAudio = ref(false);
const progressPercent = ref(0);

async function toggleAudio() {
  if (!audioRef.value) return;
  if (audioRef.value.paused) {
    try {
      await audioRef.value.play();
      isPlayingAudio.value = true;
    } catch (error) {
      isPlayingAudio.value = false;
      console.error("No se pudo reproducir el audio.", error);
    }
  } else {
    audioRef.value.pause();
    isPlayingAudio.value = false;
  }
}

function onTimeUpdate() {
  if (audioRef.value && audioRef.value.duration) {
    progressPercent.value =
      (audioRef.value.currentTime / audioRef.value.duration) * 100;
  }
}

function onEnded() {
  isPlayingAudio.value = false;
  progressPercent.value = 0;
}
</script>

<style scoped>
.audio-section {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

/* TARJETA CONTENEDORA VERDE */
.audio-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  background-color: #235848; /* Verde bosque de la tarjeta */
  border-radius: 18px;
  padding: 24px 16px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

/* ILUSTRACIONES LATERALES */
.ilustracion {
  height: auto;
  pointer-events: none;
  z-index: 2;
}

.ilustracion.ray {
  width: 75px;
  margin-right: -10px;
}

.ilustracion.mariposa {
  width: 55px;
  margin-left: -10px;
  align-self: flex-end;
  margin-bottom: 12px;
}

/* CONTENIDO CENTRAL */
.audio-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 3;
}

.audio-title {
  color: #e5c158; /* Dorado elegante */
  font-family: "Cormorant", serif;
  font-size: 0.95rem;
  font-weight: bold;
  letter-spacing: 1.2px;
  line-height: 1.3;
  margin: 0 0 14px 0;
}

/* CONTROLES Y BOTONES */
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.decoracion-flor {
  color: #e5c158;
  font-size: 0.75rem;
}

.btn-step {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0.85;
  padding: 0;
  display: flex;
  align-items: center;
}

.btn-play {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #e5c158;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.btn-play:active {
  transform: scale(0.92);
}

.icon-play {
  color: #ffffff;
  font-size: 0.85rem;
  margin-left: 2px; /* Centrado visual del triángulo */
}

.icon-pause {
  color: #ffffff;
  font-size: 0.75rem;
}

/* BARRA DE PROGRESO */
.progress-container {
  width: 100%;
  max-width: 170px;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.4);
  position: relative;
  border-radius: 2px;
}

.progress-bar {
  height: 100%;
  background-color: #e5c158;
  border-radius: 2px;
  position: relative;
}

/* BOLITA BLANCA EN LA BARRA DE PROGRESO */
.progress-bar::after {
  content: "";
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  background-color: #ffffff;
  border-radius: 50%;
}

@media (max-width: 360px) {
  .ilustracion.ray {
    width: 60px;
  }
  .ilustracion.mariposa {
    width: 45px;
  }
  .audio-title {
    font-size: 0.85rem;
  }
}
</style>
