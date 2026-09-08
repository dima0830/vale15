<template>
  <main class="invitation-shell">
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
