<template>
  <section ref="seccionRef" class="invitacion-seccion">
    <!-- ENCABEZADO Y PADRES -->
    <div class="header-container fade-in-element">
      <p class="subtitulo">
        ACOMPÁÑAME EN ESTE DÍA TAN ESPECIAL JUNTO A MIS PADRES:
      </p>

      <div class="padres-box">
        <h2 class="nombre-padre">
          Milena Díaz
          <img
            src="~/assets/images/mariposa-.png"
            class="mini-mariposa top"
            alt="mariposa"
          />
        </h2>
        <span class="ampersand">&amp;</span>
        <h2 class="nombre-padre">
          Mauricio Artunduaga
          <img
            src="~/assets/images/mariposa-.png"
            class="mini-mariposa bottom"
            alt="mariposa"
          />
        </h2>
      </div>
    </div>

    <!-- TÍTULO EVENTO -->
    <div class="evento-box fade-in-element delay-1">
      <p class="subtitulo-festejar">A FESTEJAR MIS</p>
      <h1 class="xv-title">XV</h1>
      <img
        src="~/assets/images/mariposa-.png"
        class="mariposa-centrada float-anim"
        alt="mariposa dorada"
      />
    </div>

    <!-- COUNTDOWN EVENTO -->
    <div class="evento-box fade-in-element delay-2">
      <p class="subtitulo-festejar2">FALTAN</p>
      <CountdownTimer :event-date="eventDate" />
    </div>

    <!-- FECHA PRINCIPAL CON BRILLO -->
    <div class="fecha-principal fade-in-element delay-3">
      <h2 class="mes-title">Septiembre</h2>
      <div class="fecha-filadecorada">
        <span class="dia-texto">SÁBADO</span>
        <span class="numero-dia pulse-glow">26</span>
        <span class="anio-texto">2026</span>
      </div>
    </div>

    <!-- CALENDARIO CON NAVEEN -->
    <div class="calendario-wrapper fade-in-element delay-4">
      <div class="card-calendario">
        <div class="grid-dias header">
          <span>LUN</span><span>MAR</span><span>MIE</span><span>JUE</span>
          <span>VIE</span><span>SAB</span><span>DOM</span>
        </div>

        <div class="grid-dias numeros">
          <span class="empty"></span>
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          <span>6</span><span>7</span><span>8</span><span>9</span>
          <span>10</span><span>11</span><span>12</span><span>13</span>
          <span>14</span><span>15</span><span>16</span><span>17</span>
          <span>18</span><span>19</span><span>20</span><span>21</span>
          <span>22</span><span>23</span><span>24</span><span>25</span>

          <span class="dia-destacado">
            26
            <svg
              class="corazon-svg heartbeat"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#235848"
              stroke-width="2"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </span>

          <span>27</span>
          <span>28</span><span>29</span><span>30</span>
        </div>
      </div>

      <img src="~/assets/images/sapo.png" alt="Sapo Naveen" class="rana-img" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import CountdownTimer from "~/components/CountdownTimer.vue";

defineProps<{
  eventDate: string;
}>();

const seccionRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!seccionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Agrega la clase activa al detectar la sección en el viewport
          seccionRef.value?.classList.add("is-visible");
          if (observer) observer.disconnect(); // Desconecta para que no repita la animación
        }
      });
    },
    { threshold: 0.15 }, // Se activa cuando el 15% de la sección es visible
  );

  observer.observe(seccionRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* ESTRUCTURA GENERAL */
.invitacion-seccion {
  position: relative;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 50px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #235848;
  text-align: center;
  background-image: url("~/assets/images/fondo.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* TEXTOS Y TIPOGRAFÍAS */
.subtitulo,
.subtitulo-festejar {
  font-family: "Cormorant", serif;
  font-size: 20px;
  letter-spacing: 1.2px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #235848;
}

.subtitulo-festejar2 {
  font-family: "Cormorant", serif;
  font-size: 20px;
  letter-spacing: 0.2px;
  margin-top: 20px;
  margin-bottom: -20px;
  font-weight: 600;
  color: #235848;
}

/* SECCIÓN PADRES */
.padres-box {
  position: relative;
  margin: 30px 0 30px 0;
}

.nombre-padre {
  font-family: "Great Vibes", cursive;
  font-size: 40px;
  font-weight: 400;
  margin: 0;
  position: relative;
  display: inline-block;
  color: #a39236;
  transition: transform 0.3s ease;
}

.nombre-padre:hover {
  transform: scale(1.05);
}

.ampersand {
  display: block;
  font-family: "Great Vibes", cursive;
  font-size: 40px;
  margin: -6px 0;
  color: #a39236;
}

.mini-mariposa {
  position: absolute;
  width: 22px;
  height: auto;
  animation: flutter 3s ease-in-out infinite alternate;
}
.mini-mariposa.top {
  top: 0;
  right: -24px;
}
.mini-mariposa.bottom {
  top: -4px;
  left: -24px;
  animation-delay: 1.5s;
}

/* TÍTULO XV */
.xv-title {
  font-family: "Cormorant", serif;
  font-size: 54px;
  font-weight: 400;
  margin: 0;
  line-height: 1;
  color: #4a8e5c;
  transition: transform 0.3s ease;
}

.xv-title:hover {
  transform: scale(1.08);
}

.mariposa-centrada {
  width: 48px;
  margin: 8px 0;
}

/* FECHA PRINCIPAL */
.fecha-principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 380px;
  margin: 20px auto;
  text-align: center;
}

.mes-title {
  font-family: "Great Vibes", "Playfair Display", cursive;
  font-size: 3.2rem;
  color: #235848;
  font-weight: 400;
  margin: 0 0 10px 0;
  line-height: 1;
}

.fecha-filadecorada {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 15px;
}

.dia-texto,
.anio-texto {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 1.1rem;
  color: #1a1a1a;
  letter-spacing: 2px;
  font-weight: 500;
}

.dia-texto::before,
.dia-texto::after,
.anio-texto::before,
.anio-texto::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5px;
  background-color: #d4a359;
}

.dia-texto::before,
.anio-texto::before {
  top: 0;
}

.dia-texto::after,
.anio-texto::after {
  bottom: 0;
}

.numero-dia {
  font-family: "Cormorant Garamond", serif;
  font-size: 3.2rem;
  font-weight: 600;
  font-style: italic;
  color: #2e6b58;
  padding: 0 10px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* CALENDARIO */
.calendario-wrapper {
  position: relative;
  width: 100%;
  margin-top: 40px;
}

.card-calendario {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 18px 12px 35px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card-calendario:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.grid-dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px 2px;
  font-family: "Cinzel", serif;
}

.grid-dias.header {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.grid-dias.numeros {
  font-size: 1rem;
}

.grid-dias.numeros span:not(.empty) {
  transition:
    transform 0.2s ease,
    color 0.2s ease;
}

.grid-dias.numeros span:not(.empty):hover {
  transform: scale(1.2);
  color: #a39236;
}

.dia-destacado {
  position: relative;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.corazon-svg {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.rana-img {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: auto;
  z-index: 5;
  pointer-events: none;
}

/* =========================================
   ESTADOS DE ANIMACIÓN ON-SCROLL
========================================= */

/* Estado inicial (oculto antes del scroll) */
.fade-in-element {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Estado activo (cuando el scroll llega a la sección) */
.invitacion-seccion.is-visible .fade-in-element {
  opacity: 1;
  transform: translateY(0);
}

/* Delays escalonados para la entrada secuencial */
.invitacion-seccion.is-visible .delay-1 {
  transition-delay: 0.15s;
}
.invitacion-seccion.is-visible .delay-2 {
  transition-delay: 0.3s;
}
.invitacion-seccion.is-visible .delay-3 {
  transition-delay: 0.45s;
}
.invitacion-seccion.is-visible .delay-4 {
  transition-delay: 0.6s;
}

/* ANIMACIONES CONTINUAS (Mariposa, Sapo, Corazón) */
.float-anim {
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
  }
}

@keyframes flutter {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-4px) scale(1.1) rotate(-5deg);
  }
}

@keyframes floatRana {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.heartbeat {
  animation: heartPulse 2s ease-in-out infinite;
}

@keyframes heartPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  14% {
    transform: translate(-50%, -50%) scale(1.15);
  }
  28% {
    transform: translate(-50%, -50%) scale(1);
  }
  42% {
    transform: translate(-50%, -50%) scale(1.12);
  }
  70% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.pulse-glow {
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  0% {
    text-shadow: 0 0 0px rgba(46, 107, 88, 0);
  }
  100% {
    text-shadow: 0 0 10px rgba(46, 107, 88, 0.3);
  }
}

/* ADAPTACIÓN MÓVIL */
@media (max-width: 480px) {
  .mes-title {
    font-size: 2.8rem;
  }

  .dia-texto,
  .anio-texto {
    font-size: 0.95rem;
    letter-spacing: 1.5px;
  }

  .numero-dia {
    font-size: 2.8rem;
    padding: 0 6px;
  }

  .fecha-filadecorada {
    gap: 10px;
  }
}
</style>
