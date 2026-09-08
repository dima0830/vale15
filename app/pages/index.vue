<template>
  <main class="invitation-shell">
    <nav class="site-nav" aria-label="Navegación principal">
      <a href="#inicio" class="nav-mark">.</a>
      <div class="nav-links">
        <a href="#historia">Nuestra historia</a>
        <a href="#detalles">Detalles</a>
        <a href="#fotos">Recuerdos</a>
      </div>
    </nav>

    <InvitationHero />
    <InvitationAudio />
    <InvitationIntro />
    <InvitationCelebration :event-date="eventDate" />
    <InvitationDetails />
    <InvitationMemories />
    <DressCodeSection />
    <PhotoUpload />
    <InvitationGifts />
    <InvitationForm />
    <InvitationFinal />
  </main>
</template>

<script setup lang="ts">
const eventDate = "2026-09-26T18:00:00";
</script>
