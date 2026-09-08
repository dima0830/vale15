<template>
  <div id="fotos" ref="seccionRef" class="memories-section">
    <!-- SECCIÓN FRASCO Y ÁLBUM COMPARTIDO -->
    <section class="memory-intro content-width fade-in-element">
      <div class="tabla-container">
        <!-- IMAGEN DE LA TABLA DE MADERA -->
        <img
          src="~/assets/images/tabla.png"
          alt="Letrero de madera decorado"
          class="tabla-img"
        />
        <!-- TEXTO SOBRE LA TABLA -->
        <div class="texto-wrapper">
          <h2 class="frase-texto">
            LA NIÑA QUE SOÑÓ<br />
            CON ESTRELLAS<br />
            HOY FLORECE
          </h2>
        </div>
      </div>

      <!-- SECCIÓN GALERÍA -->
      <div class="gallery-section content-width fade-in-element delay-1">
        <GalleryCarousel :images="galleryImages" />
      </div>

      <p class="texto-descripcion">
        Cada foto cuenta la historia de una pequeña flor de Bayou que con amor y
        sueños se transformó en la joven que soy hoy.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import GalleryCarousel from "~/components/GalleryCarousel.vue";
import galleryOne from "~/assets/images/gal1.jpg";
import galleryTwo from "~/assets/images/gal2.jpg";
import galleryThree from "~/assets/images/gal3.jpg";
import galleryFour from "~/assets/images/gal4.jpg";
import galleryFive from "~/assets/images/gal5.jpg";
import gallerySix from "~/assets/images/gal6.jpg";
import gallerySeven from "~/assets/images/gal7.jpg";
import galleryEight from "~/assets/images/gal8.jpg";
import galleryNine from "~/assets/images/gal9.jpg";
import galleryTen from "~/assets/images/gal10.jpg";
import galleryEleven from "~/assets/images/gal11.jpg";
import galleryTwelve from "~/assets/images/gal12.jpg";
import galleryThirteen from "~/assets/images/gal13.jpg";
import galleryFourteen from "~/assets/images/gal14.jpg";

const galleryImages = [
  { src: galleryOne, alt: "Anillos" },
  { src: galleryTwo, alt: "Flores" },
  { src: galleryThree, alt: "Momento especial" },
  { src: galleryFour, alt: "Recuerdo de la celebración" },
  { src: galleryFive, alt: "Recuerdo de la celebración" },
  { src: gallerySix, alt: "Recuerdo de la celebración" },
  { src: gallerySeven, alt: "Recuerdo de la celebración" },
  { src: galleryEight, alt: "Recuerdo de la celebración" },
  { src: galleryNine, alt: "Recuerdo de la celebración" },
  { src: galleryTen, alt: "Recuerdo de la celebración" },
  { src: galleryEleven, alt: "Recuerdo de la celebración" },
  { src: galleryTwelve, alt: "Recuerdo de la celebración" },
  { src: galleryThirteen, alt: "Recuerdo de la celebración" },
  { src: galleryFourteen, alt: "Recuerdo de la celebración" },
];

/* LÓGICA DE INTERSECTION OBSERVER PARA ANIMACIÓN ON-SCROLL */
const seccionRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!seccionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          seccionRef.value?.classList.add("is-visible");
          if (observer) observer.disconnect();
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(seccionRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* ESTRUCTURA GENERAL */
.memories-section {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 40px 15px 2px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 50px;
  text-align: center;
  color: #235848;
}

.content-width {
  width: 100%;
  margin: 0 auto;
}

/* TABLA DE MADERA Y FRASE */
.tabla-container {
  position: relative;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabla-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.12));
}

.texto-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  pointer-events: none;
  z-index: 2;
}

.frase-texto {
  font-family: "Cormorant", serif;
  font-size: 1.02rem;
  font-weight: 600;
  color: #1e4d3e !important;
  letter-spacing: 1.5px;
  line-height: 1.35;
  text-align: center;
  margin: 24px 0 0;
  text-transform: uppercase;
}
.texto-descripcion {
  font-family: "Cormorant", serif;
  font-size: 1.02rem;
  font-weight: 600;
  color: #1e4d3e !important;
  letter-spacing: 1.2px;
  line-height: 1.35;
  text-align: center;
  text-transform: uppercase;
}

/* ANIMACIONES ON-SCROLL */
.fade-in-element {
  opacity: 0;
  transform: translateY(35px) scale(0.97);
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.memories-section.is-visible .fade-in-element {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.memories-section.is-visible .delay-1 {
  transition-delay: 0.2s;
}

/* RESPONSIVE */
@media (max-width: 360px) {
  .frase-texto {
    font-size: 0.95rem;
    letter-spacing: 1px;
  }
}
</style>
