<template>
  <section class="dresscode-section">
    <div class="top-butterfly-wrapper">
      <img
        src="~/assets/images/mariposa.png"
        alt="Mariposa esmeralda"
        class="butterfly-top"
      />
    </div>

    <header class="title-container">
      <h2 class="script-title">Código de</h2>
      <h1 class="main-title">VESTIMENTA</h1>
    </header>

    <div class="icon-container">
      <img
        src="~/assets/images/traje.png"
        alt="Ilustración traje y vestido"
        class="attire-icon"
      />
    </div>

    <div class="tag-container">
      <span class="dresscode-tag">TRAJE DE COLOR NEGRO</span>
    </div>

    <div class="scroll-container">
      <p class="reserved-text">NOS RESERVAMOS<br />EL COLOR:</p>

      <!-- MARCO DEL PERGAMINO CON SÓLO EL TEXTO "VERDE" -->
      <div class="scroll-wrapper">
        <img
          src="~/assets/images/pergamino.png"
          alt="Pergamino de madera"
          class="scroll-bg"
        />

        <div class="scroll-content">
          <span class="color-highlight">Verde</span>
        </div>

        <img
          src="~/assets/images/mariposa-.png"
          alt="Mariposa verde"
          class="butterfly-scroll"
        />
      </div>

      <!-- TEXTO UBICADO FUERA Y DEBAJO DEL PERGAMINO -->
      <p class="scroll-note">
        Con mucho cariño les pedimos evitar el tono verde. Ya que está reservado
        especialmente para la Quinceañera
      </p>
    </div>

    <div class="character-container">
      <img src="~/assets/images/sapo.png" alt="Rana animada" class="frog-img" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Componente maquetado para la sección Código de Vestimenta
</script>

<style scoped>
.dresscode-section {
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 2px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #1e4d3e;
}

.top-butterfly-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 5px;
}

.butterfly-top {
  width: 45px;
  height: auto;
  transform: rotate(-10deg);
}

.title-container {
  margin-bottom: 25px;
}

.script-title {
  font-family: "Great Vibes", "Cormorant Garamond", cursive;
  font-size: 2.4rem;
  color: #c9a45c;
  font-weight: 400;
  margin: 0;
  line-height: 1;
}

.main-title {
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1c4b3c;
  letter-spacing: 2px;
  margin: -5px 0 0 0;
}

.icon-container {
  margin-bottom: 25px;
}

.attire-icon {
  width: 140px;
  height: auto;
  display: block;
}

.tag-container {
  margin-bottom: 30px;
  width: 100%;
}

.dresscode-tag {
  display: inline-block;
  width: 90%;
  background-color: #88c867;
  color: #1c4b3c;
  font-family: "Open Sans", sans-serif;
  font-weight: 800;
  font-size: 0.9rem;
  padding: 10px 15px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.scroll-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reserved-text {
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1c4b3c;
  letter-spacing: 1px;
  margin-bottom: 12px;
  line-height: 1.3;
}

.scroll-wrapper {
  position: relative;
  width: 100%;
  max-width: 340px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-bg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.scroll-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.color-highlight {
  font-family: "Great Vibes", "Cormorant Garamond", cursive;
  font-size: 3.5rem;
  color: #1c4b3c;
  line-height: 1;
}

/* ESTILOS AJUSTADOS PARA EL TEXTO FUERA DE LA IMAGEN */
.scroll-note {
  font-family: "Open Sans", sans-serif;
  font-size: 0.8rem;
  color: #2d4036;
  line-height: 1.35;
  margin-top: 1px;
  font-weight: 600;
  width: 90%;
}

.butterfly-scroll {
  position: absolute;
  top: 10px;
  right: -10px;
  width: 65px;
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
}

.character-container {
  margin-top: 25px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.frog-img {
  width: 130px;
  height: auto;
  display: block;
}
</style>
