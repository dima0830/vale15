<template>
  <section
    ref="sectionRef"
    class="gifts-section"
    :class="{ 'is-visible': isVisible }"
    aria-labelledby="gifts-title"
  >
    <!-- PERSONAJE: RANITAS (ARRIBA A LA DERECHA) -->
    <img
      src="~/assets/images/sapo1.png"
      alt="Ranitas animadas"
      class="character character-frogs"
    />

    <!-- MARIPOSA FLOTANTE IZQUIERDA -->
    <img
      src="~/assets/images/mariposa-.png"
      alt=""
      class="butterfly butterfly-top-left"
      aria-hidden="true"
    />

    <!-- ENCABEZADO -->
    <p class="eyebrow-text animated-item delay-1">
      TU COMPAÑÍA ILUMINA<br />MI NOCHE.
    </p>

    <header class="title-container animated-item delay-2">
      <h2 class="script-title">Sugerencia de</h2>
      <h1 id="gifts-title" class="main-title">REGALOS</h1>
    </header>

    <!-- ÍCONO Y TEXTO SOBRE -->
    <div class="envelope-container animated-item delay-3">
      <svg
        class="envelope-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      <p class="envelope-text">Lluvia de sobres</p>
    </div>

    <!-- MARIPOSA FLOTANTE DERECHA -->
    <img
      src="~/assets/images/mariposa-.png"
      alt=""
      class="butterfly butterfly-bottom-right"
      aria-hidden="true"
    />

    <!-- SELLO DE NIÑOS PEQUEÑO -->
    <div class="no-kids-container animated-item delay-4">
      <img
        src="~/assets/images/sello-2.png"
        alt="Solo jóvenes y adultos, no niños pequeños"
        class="stamp-img"
      />
    </div>

    <!-- PERSONAJE: COCODRILO (ABAJO A LA IZQUIERDA) -->
    <img
      src="~/assets/images/cocodrilo.png"
      alt="Cocodrilo tocando trompeta"
      class="character character-croc"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sectionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          if (observer) observer.disconnect();
        }
      });
    },
    { threshold: 0.15 },
  );

  observer.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.gifts-section {
  position: relative;
  width: 100%;
  max-width: 390px;
  min-height: 600px;
  margin: 0 auto;
  padding: 60px 20px 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  color: #1c4b3c;
  text-align: center;
}

/* PERSONAJES EN POSICIONES DIVERSIFICADAS */
.character {
  position: absolute;
  height: auto;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.8s ease,
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.character-frogs {
  top: 90px;
  right: -20px;
  width: 120px;
  transform: translateY(-20px) rotate(5deg);
}

.character-croc {
  bottom: 1px;
  left: -20px;
  width: 120px;
  transform: translateY(20px) rotate(-5deg);
}

.gifts-section.is-visible .character-frogs {
  opacity: 1;
  transform: translateY(0) rotate(5deg);
}

.gifts-section.is-visible .character-croc {
  opacity: 1;
  transform: translateY(0) rotate(0deg);
}

/* MARIPOSAS DECORATIVAS */
.butterfly {
  position: absolute;
  width: 60px;
  height: auto;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.butterfly-top-left {
  top: 85px;
  left: 20px;
  transform: rotate(-20deg);
}

.butterfly-bottom-right {
  bottom: 120px;
  right: 20px;
  transform: rotate(15deg);
}

/* ENCABEZADOS Y TEXTOS */
.eyebrow-text {
  margin: 10px 0 25px;
  color: #1c4b3c;
  font-family: "Cormorant", serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  line-height: 1.3;
}

.title-container {
  margin-bottom: 25px;
}

.script-title {
  margin: 20px 0 0;
  color: #c9a45c;
  font-family: "Great Vibes", "Cormorant Garamond", cursive;
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1;
}

.main-title {
  margin: -5px 0 0;
  color: #1c4b3c;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.envelope-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.envelope-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  color: #8cc665;
}

.envelope-text {
  margin: 0;
  color: #1c4b3c;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 1.05rem;
  font-weight: 600;
}

/* SELLO INFERIOR AJUSTADO Y PEQUEÑO */
.no-kids-container {
  margin-top: 5px;
  padding: 5px 0;
  z-index: 3;
}

.stamp-img {
  width: 100%;
  max-width: 140px;
  height: auto;
  display: block;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.12));
}

/* ANIMACIONES DE ENTRADA ON-SCROLL */
.animated-item {
  opacity: 0;
  transform: translateY(25px);
  transition:
    opacity 0.7s ease,
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.gifts-section.is-visible .animated-item {
  opacity: 1;
  transform: translateY(0);
}

.gifts-section.is-visible .delay-1 {
  transition-delay: 0.15s;
}

.gifts-section.is-visible .delay-2 {
  transition-delay: 0.3s;
}

.gifts-section.is-visible .delay-3 {
  transition-delay: 0.45s;
}

.gifts-section.is-visible .delay-4 {
  transition-delay: 0.6s;
}

@media (min-width: 641px) {
  .gifts-section {
    max-width: 1080px;
    min-height: 580px;
    padding-inline: 3rem;
  }

  .character-frogs {
    width: 95px;
    right: 15px;
  }

  .character-croc {
    width: 150px;
    left: 10px;
  }

  .stamp-img {
    max-width: 185px;
  }
}
</style>
