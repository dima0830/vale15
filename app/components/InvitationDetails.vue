<template>
  <section ref="seccionRef" class="recepcion-seccion">
    <!-- TITULO DE LA SECCIÓN CON MARIPOSA -->
    <div class="header-box fade-in-element">
      <img
        src="~/assets/images/mariposa-.png"
        class="mariposa-top float-anim"
        alt="Mariposa"
      />
      <h2 class="titulo-recepcion">Recepción</h2>
    </div>

    <!-- IMAGEN CENTRAL CON MARCOS -->
    <div class="imagen-wrapper fade-in-element delay-1">
      <div class="marco-circular">
        <div class="marco-interno">
          <img
            src="~/assets/images/finca.jpg"
            alt="Recepción Cielo y Sazón"
            class="imagen-principal"
          />
        </div>
      </div>

      <!-- DECORACIONES LATERALES -->
      <img
        src="~/assets/images/mariposa-.png"
        alt="Mariposa izquierda"
        class="mariposa-lateral izquierda flutter-left"
      />
      <img
        src="~/assets/images/mariposa-.png"
        alt="Mariposa derecha"
        class="mariposa-lateral derecha flutter-right"
      />
    </div>

    <!-- INFORMACIÓN DEL LUGAR -->
    <div class="info-box fade-in-element delay-2">
      <h3 class="nombre-lugar">FINCA LA ANACONDA</h3>

      <a
        :href="props.locationUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-ubicacion pulse-btn"
        aria-label="Ver ubicación en Google Maps"
      >
        <span>VER UBICACIÓN</span>
        <span class="flecha" aria-hidden="true">➔</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

interface Props {
  locationUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  locationUrl:
    "https://www.google.com/maps/place/FINCA+FUNDO+ANACONDA/@4.1217619,-73.453327,17z/data=!3m1!4b1!4m6!3m5!1s0x8e158700450d9e83:0xa1784734da66fe5f!8m2!3d4.1217619!4d-73.453327!16s%2Fg%2F11vj_cd68h!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
});

const seccionRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!seccionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Activa la clase 'is-visible' únicamente al llegar a la sección con el scroll
        if (entry.isIntersecting) {
          seccionRef.value?.classList.add("is-visible");
          if (observer) observer.disconnect(); // Desconecta para que la animación se ejecute solo una vez
        }
      });
    },
    { threshold: 0.2 }, // Se dispara cuando el 20% de la sección entra en pantalla
  );

  observer.observe(seccionRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* ESTRUCTURA CONTENEDOR */
.recepcion-seccion {
  position: relative;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 60px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
}

/* HEADER Y TÍTULO */
.header-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
}

.mariposa-top {
  width: 55px;
  height: auto;
  margin-bottom: -5px;
}

.titulo-recepcion {
  font-family: "Great Vibes", cursive;
  font-size: 3.5rem;
  color: #b59848;
  font-weight: 400;
  margin: 0;
  line-height: 1;
}

/* MARCOS Y FOTO CIRCULAR */
.imagen-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 10px 0 35px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marco-circular {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #d4a359;
  padding: 6px;
  margin: 30px auto;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.4s ease,
    border-color 0.4s ease;
}

.marco-interno {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1.5px solid #d4a359;
  overflow: hidden;
  position: relative;
}

.imagen-principal {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.imagen-wrapper:hover .marco-circular {
  transform: scale(1.02);
  border-color: #b59848;
}

.imagen-wrapper:hover .imagen-principal {
  transform: scale(1.08);
}

/* MARIPOSAS LATERALES */
.mariposa-lateral {
  position: absolute;
  width: 40px;
  height: auto;
  z-index: 4;
}

.mariposa-lateral.izquierda {
  left: 5px;
  bottom: 85px;
}

.mariposa-lateral.derecha {
  right: 55px;
  bottom: 10px;
  width: 26px;
}

/* TEXTO DE UBICACIÓN Y BOTÓN */
.info-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.nombre-lugar {
  font-family: "Cormorant", serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #235848;
  letter-spacing: 1.5px;
  line-height: 1.4;
  margin: 0;
}

.btn-ubicacion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #8cc665;
  color: #ffffff;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px 32px;
  border-radius: 50px;
  margin: 20px auto;
  text-decoration: none;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(140, 198, 101, 0.3);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-ubicacion:hover {
  background-color: #7ab753;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(140, 198, 101, 0.4);
}

.flecha {
  font-size: 1.1rem;
}

/* =========================================
   ANIMACIONES ON-SCROLL
========================================= */

/* Estado inicial: ocultos y desplazados hacia abajo */
.fade-in-element {
  opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Estado activo: cuando el scroll llega a la sección */
.recepcion-seccion.is-visible .fade-in-element {
  opacity: 1;
  transform: translateY(0);
}

/* Tiempos de retraso para la entrada escalonada */
.recepcion-seccion.is-visible .delay-1 {
  transition-delay: 0.2s;
}

.recepcion-seccion.is-visible .delay-2 {
  transition-delay: 0.4s;
}

/* ANIMACIONES CONTINUAS (Mariposas y Pulso) */
.float-anim {
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(2deg);
  }
}

.flutter-left {
  animation: flutterLeft 3s ease-in-out infinite alternate;
}

@keyframes flutterLeft {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  100% {
    transform: translateY(-5px) scale(1.05) rotate(-6deg);
  }
}

.flutter-right {
  animation: flutterRight 2.8s ease-in-out infinite alternate;
}

@keyframes flutterRight {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  100% {
    transform: translateY(-4px) scale(1.08) rotate(5deg);
  }
}

.pulse-btn {
  animation: pulseGlow 2.5s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 4px 10px rgba(140, 198, 101, 0.3);
  }
  50% {
    box-shadow: 0 4px 18px rgba(140, 198, 101, 0.6);
  }
}

/* RESPONSIVE */
@media (max-width: 360px) {
  .imagen-wrapper {
    width: 240px;
    height: 240px;
  }

  .nombre-lugar {
    font-size: 1rem;
  }
}
</style>
