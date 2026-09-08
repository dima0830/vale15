<template>
  <div class="countdown-timer">
    <div class="timer-grid">
      <div v-if="eventHasPassed" class="countdown-complete">
        La celebración ya sucedió
      </div>
      <template v-else>
        <div class="time-unit">
          <div class="time-value">{{ dias }}</div>
          <div class="time-label">Días</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ horas }}</div>
          <div class="time-label">Horas</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ minutos }}</div>
          <div class="time-label">Min</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ segundos }}</div>
          <div class="time-label">Seg</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Props {
  eventDate?: string;
}

const props = withDefaults(defineProps<Props>(), {
  eventDate: "2026-09-26T18:00:00-05:00",
});

const dias = ref(0);
const horas = ref(0);
const minutos = ref(0);
const segundos = ref(0);
const eventHasPassed = ref(false);

let interval: ReturnType<typeof setInterval> | null = null;

function calcularTiempo() {
  const distance = new Date(props.eventDate).getTime() - Date.now();
  eventHasPassed.value = distance <= 0;

  if (distance <= 0) {
    dias.value = 0;
    horas.value = 0;
    minutos.value = 0;
    segundos.value = 0;
    return;
  }

  dias.value = Math.floor(distance / (1000 * 60 * 60 * 24));
  horas.value = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  minutos.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  segundos.value = Math.floor((distance % (1000 * 60)) / 1000);
}

onMounted(() => {
  calcularTiempo();
  interval = setInterval(calcularTiempo, 1000);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.countdown-timer {
  width: 100%;
  padding: 2.5rem 0;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  justify-items: center;
  max-width: min(100%, 320px);
  margin: 0 auto;
}

.time-unit {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  text-align: center;
  transition: transform 0.3s ease;
}

.time-unit:hover {
  transform: scale(1.1);
}

.time-value {
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 500;
  color: #20534a;
  font-family: "Cormorant", serif;
  line-height: 0.8;
}

.time-label {
  margin-top: 0.75rem;
  color: #20534a;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

@media (max-width: 480px) {
  .timer-grid {
    gap: 0.75rem;
  }

  .time-value {
    font-size: clamp(2.1rem, 9vw, 3rem);
  }

  .time-label {
    font-size: 0.7rem;
  }
}
</style>
