<template>
  <section class="final-section">
    <div class="final-frame">
      <img
        src="~/assets/images/final.jpg"
        alt="Momento final"
        class="final-image"
      />
    </div>
  </section>
</template>

<style scoped>
.final-section {
  width: 100%;
}

.final-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.final-image {
  display: block;
  width: 100%;
  height: min(60vw, 420px);
  object-fit: cover;
  object-position: center 30%;
}
</style>
