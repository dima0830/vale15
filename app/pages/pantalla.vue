<template>
  <main class="stage" :class="{ idle: isIdle }" @click="toggleFullscreen" @mousemove="wakeCursor">
    <!-- LUCIÉRNAGAS DE FONDO -->
    <div class="fireflies" aria-hidden="true">
      <span
        v-for="f in fireflies"
        :key="f.id"
        class="firefly"
        :style="{
          left: f.x + '%',
          top: f.y + '%',
          width: f.size + 'px',
          height: f.size + 'px',
          animationDuration: `${f.drift}s, ${f.glow}s`,
          animationDelay: `-${f.delay}s, -${f.delay}s`,
        }"
      />
    </div>

    <!-- ENCABEZADO -->
    <header class="stage-header">
      <img src="~/assets/images/luci.png" alt="" class="header-ray" />
      <img src="~/assets/images/nombre-vale.png" alt="Los Quince Años de Vale" class="header-title" />
    </header>

    <!-- MURO IZQUIERDO -->
    <section class="wall wall-left">
      <div v-for="i in SLOTS_PER_SIDE" :key="'l' + i" class="tile">
        <Transition name="tile">
          <img v-if="slots[i - 1]" :key="slots[i - 1]!.id" :src="slots[i - 1]!.url" alt="" />
          <span v-else class="tile-empty">✿</span>
        </Transition>
      </div>
    </section>

    <!-- FOTO DESTACADA -->
    <section class="featured">
      <Transition name="feature">
        <figure v-if="featured" :key="featured.id" class="featured-frame">
          <div class="featured-photo">
            <img :src="featured.url" alt="" class="featured-blur" aria-hidden="true" />
            <img :src="featured.url" :alt="featured.guestName || 'Foto de invitado'" class="featured-img" />
            <span v-if="featuredIsFresh" class="fresh-badge">✨ ¡Nueva foto!</span>
          </div>
          <figcaption class="featured-caption">
            <template v-if="featured.guestName">— {{ featured.guestName }}</template>
            <template v-else>Un recuerdo de esta noche</template>
          </figcaption>
        </figure>
        <div v-else class="featured-empty">
          <p class="empty-script">Las fotos de la fiesta</p>
          <p class="empty-caps">aparecerán aquí</p>
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="Código QR para subir fotos" class="empty-qr" />
          <p class="empty-hint">Escanea el código y comparte tus recuerdos</p>
        </div>
      </Transition>
    </section>

    <!-- MURO DERECHO -->
    <section class="wall wall-right">
      <div v-for="i in SLOTS_PER_SIDE" :key="'r' + i" class="tile">
        <Transition name="tile">
          <img
            v-if="slots[SLOTS_PER_SIDE + i - 1]"
            :key="slots[SLOTS_PER_SIDE + i - 1]!.id"
            :src="slots[SLOTS_PER_SIDE + i - 1]!.url"
            alt=""
          />
          <span v-else class="tile-empty">✿</span>
        </Transition>
      </div>
    </section>

    <!-- PIE CON QR -->
    <footer class="stage-footer">
      <img v-if="qrDataUrl" :src="qrDataUrl" alt="Código QR para subir fotos" class="footer-qr" />
      <div class="footer-text">
        <p class="footer-script">Comparte tus fotos</p>
        <p class="footer-caps">Escanea el código · súbelas desde la invitación</p>
      </div>
      <p v-if="photos.length" class="footer-count">
        <strong>{{ photos.length }}</strong>
        {{ photos.length === 1 ? "recuerdo compartido" : "recuerdos compartidos" }}
      </p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import QRCode from "qrcode";

definePageMeta({ layout: false });

useHead({
  title: "Recuerdos · XV Vale",
  meta: [{ name: "robots", content: "noindex, nofollow" }],
});

interface Photo {
  id: number;
  url: string;
  guestName: string | null;
}

const SLOTS_PER_SIDE = 6;
const TOTAL_SLOTS = SLOTS_PER_SIDE * 2;
const POLL_MS = 15_000; // cada cuánto se consultan fotos nuevas
const FEATURE_MS = 8_000; // cada cuánto cambia la destacada
const TILE_SWAP_MS = 3_500; // cada cuánto cambia una miniatura del muro

const photos = ref<Photo[]>([]); // aprobadas, más recientes primero
const slots = ref<(Photo | null)[]>(Array(TOTAL_SLOTS).fill(null));
const featured = ref<Photo | null>(null);
const featuredIsFresh = ref(false);
const qrDataUrl = ref("");
const isIdle = ref(false);

// Fotos aprobadas después de abrir la pantalla: salen primero como destacadas.
const freshQueue: Photo[] = [];
const knownIds = new Set<number>();
let rotationIndex = 0;
let firstLoad = true;
const timers: ReturnType<typeof setInterval>[] = [];
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let wakeLock: { release: () => Promise<void> } | null = null;

const fireflies = Array.from({ length: 34 }, (_, id) => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  drift: 14 + Math.random() * 18,
  glow: 2 + Math.random() * 3.5,
  delay: Math.random() * 20,
}));

const photosById = computed(() => new Map(photos.value.map((p) => [p.id, p])));

function preload(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = url;
  });
}

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

async function fetchPhotos() {
  let incoming: Photo[];
  try {
    const res = await $fetch<{ ok: true; photos: Photo[] }>("/api/photos");
    incoming = res.photos;
  } catch {
    return; // sin red momentáneamente: seguimos mostrando lo que hay
  }

  for (const p of [...incoming].reverse()) {
    if (!knownIds.has(p.id)) {
      knownIds.add(p.id);
      if (!firstLoad) freshQueue.push(p);
    }
  }
  photos.value = incoming;

  // Quita lo que el moderador haya rechazado después de aprobar.
  const alive = photosById.value;
  slots.value = slots.value.map((s) => (s && alive.has(s.id) ? s : null));
  for (let i = freshQueue.length - 1; i >= 0; i--) {
    if (!alive.has(freshQueue[i]!.id)) freshQueue.splice(i, 1);
  }
  if (featured.value && !alive.has(featured.value.id)) {
    featured.value = null;
    await nextFeatured();
  }

  if (firstLoad) {
    firstLoad = false;
    const initial = shuffle(incoming).slice(0, TOTAL_SLOTS);
    await Promise.all(initial.map((p) => preload(p.url)));
    slots.value = slots.value.map((_, i) => initial[i] ?? null);
    await nextFeatured();
  } else {
    await fillEmptySlots();
    if (!featured.value) await nextFeatured();
  }
}

async function nextFeatured() {
  let next: Photo | undefined;
  let fresh = false;

  if (freshQueue.length) {
    next = freshQueue.shift();
    fresh = true;
  } else if (photos.value.length) {
    rotationIndex = rotationIndex % photos.value.length;
    next = photos.value[rotationIndex];
    rotationIndex++;
    if (next && next.id === featured.value?.id && photos.value.length > 1) {
      next = photos.value[rotationIndex % photos.value.length];
      rotationIndex++;
    }
  }

  if (!next) return;
  await preload(next.url);
  featured.value = next;
  featuredIsFresh.value = fresh;

  // La nueva también entra al muro para que se quede a la vista.
  if (fresh && !slots.value.some((s) => s?.id === next!.id)) {
    placeInSlot(next);
  }
}

function placeInSlot(photo: Photo) {
  const empty = slots.value.findIndex((s) => !s);
  const index = empty >= 0 ? empty : Math.floor(Math.random() * TOTAL_SLOTS);
  const copy = [...slots.value];
  copy[index] = photo;
  slots.value = copy;
}

function candidatesForWall() {
  const shown = new Set(slots.value.filter(Boolean).map((s) => s!.id));
  if (featured.value) shown.add(featured.value.id);
  return photos.value.filter((p) => !shown.has(p.id));
}

async function fillEmptySlots() {
  const candidates = shuffle(candidatesForWall());
  const copy = [...slots.value];
  for (let i = 0; i < copy.length && candidates.length; i++) {
    if (!copy[i]) {
      const photo = candidates.shift()!;
      await preload(photo.url);
      copy[i] = photo;
    }
  }
  slots.value = copy;
}

async function swapRandomTile() {
  const candidates = candidatesForWall();
  if (!candidates.length) return;
  // Leve preferencia por las más recientes para que el muro se sienta vivo.
  const pool = Math.random() < 0.5 ? candidates.slice(0, 8) : candidates;
  const photo = pool[Math.floor(Math.random() * pool.length)]!;
  await preload(photo.url);
  const copy = [...slots.value];
  copy[Math.floor(Math.random() * TOTAL_SLOTS)] = photo;
  slots.value = copy;
}

async function buildQr() {
  qrDataUrl.value = await QRCode.toDataURL(`${location.origin}/#fotos`, {
    margin: 1,
    width: 360,
    color: { dark: "#12302a", light: "#fffaf0" },
  });
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function wakeCursor() {
  isIdle.value = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => (isIdle.value = true), 2500);
}

// Evita que el computador del proyector apague la pantalla.
async function keepScreenAwake() {
  try {
    wakeLock = await (navigator as any).wakeLock?.request("screen");
  } catch {}
}

function onVisibility() {
  if (document.visibilityState === "visible") keepScreenAwake();
}

onMounted(async () => {
  buildQr();
  keepScreenAwake();
  wakeCursor();
  document.addEventListener("visibilitychange", onVisibility);
  await fetchPhotos();
  timers.push(setInterval(fetchPhotos, POLL_MS));
  timers.push(setInterval(nextFeatured, FEATURE_MS));
  timers.push(setInterval(swapRandomTile, TILE_SWAP_MS));
});

onBeforeUnmount(() => {
  timers.forEach(clearInterval);
  clearTimeout(idleTimer);
  document.removeEventListener("visibilitychange", onVisibility);
  wakeLock?.release().catch(() => {});
});
</script>

<style scoped>
.stage {
  --emerald-deep: #0c211c;
  --emerald: #12302a;
  --emerald-soft: #1d4a3e;
  --gold: #e5c158;
  --gold-soft: #c49a45;
  --cream: #fffaf0;

  position: fixed;
  inset: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1.55fr 1fr;
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "header header header"
    "left featured right"
    "footer footer footer";
  gap: 2.2vh 1.8vw;
  padding: 2.5vh 2.5vw 2.2vh;
  box-sizing: border-box;
  color: var(--cream);
  background:
    radial-gradient(ellipse 60% 55% at 50% 45%, rgba(229, 193, 88, 0.14), transparent 70%),
    radial-gradient(ellipse 90% 70% at 50% 110%, rgba(29, 74, 62, 0.9), transparent 70%),
    linear-gradient(160deg, var(--emerald) 0%, var(--emerald-deep) 100%);
  font-family: "Cormorant Garamond", serif;
  cursor: default;
}

.stage.idle {
  cursor: none;
}

/* ---------- LUCIÉRNAGAS ---------- */
.fireflies {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.firefly {
  position: absolute;
  border-radius: 50%;
  background: #fff6c2;
  box-shadow:
    0 0 6px 2px rgba(255, 230, 140, 0.9),
    0 0 18px 6px rgba(229, 193, 88, 0.45);
  animation-name: drift, glow;
  animation-timing-function: ease-in-out, ease-in-out;
  animation-iteration-count: infinite, infinite;
  animation-direction: alternate, alternate;
}

@keyframes drift {
  0% { transform: translate(0, 0); }
  33% { transform: translate(3vw, -4vh); }
  66% { transform: translate(-2vw, -8vh); }
  100% { transform: translate(2vw, -12vh); }
}

@keyframes glow {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 1; }
}

/* ---------- ENCABEZADO ---------- */
.stage-header {
  grid-area: header;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-title {
  height: 11vh;
  width: auto;
  filter: drop-shadow(0 0.4vh 1.2vh rgba(0, 0, 0, 0.55));
}

.header-ray {
  height: 9vh;
  width: auto;
  margin-right: 1.5vw;
  transform: rotate(-12deg);
  animation: bob 4s ease-in-out infinite;
  filter: drop-shadow(0 0 1.5vh rgba(255, 230, 140, 0.55));
}

@keyframes bob {
  0%, 100% { transform: rotate(-12deg) translateY(0); }
  50% { transform: rotate(-6deg) translateY(-1.2vh); }
}

/* ---------- MUROS DE MINIATURAS ---------- */
.wall {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1.4vh;
  min-height: 0;
}

.wall-left { grid-area: left; }
.wall-right { grid-area: right; }

.tile {
  position: relative;
  overflow: hidden;
  border-radius: 1.2vh;
  background: rgba(255, 250, 240, 0.04);
  border: 1px solid rgba(229, 193, 88, 0.35);
  box-shadow: 0 0.8vh 2.4vh rgba(0, 0, 0, 0.35);
}

.tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(229, 193, 88, 0.25);
  font-size: 3.5vh;
}

.tile-enter-active {
  transition: opacity 1.4s ease, transform 1.8s ease;
}
.tile-leave-active {
  transition: opacity 1.4s ease;
}
.tile-enter-from {
  opacity: 0;
  transform: scale(1.12);
}
.tile-leave-to {
  opacity: 0;
}

/* ---------- DESTACADA ---------- */
.featured {
  grid-area: featured;
  position: relative;
  z-index: 2;
  min-height: 0;
}

.featured-frame {
  position: absolute;
  inset: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: 1.2vh 1.2vh 0;
  background: linear-gradient(145deg, #f7e7b0, var(--gold-soft) 45%, #f3dc93 70%, #a9812f);
  border-radius: 1.6vh;
  box-shadow:
    0 2.4vh 6vh rgba(0, 0, 0, 0.55),
    0 0 8vh rgba(229, 193, 88, 0.22);
}

.featured-photo {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 1vh;
  background: var(--emerald-deep);
}

.featured-blur {
  position: absolute;
  top: -6%;
  left: -6%;
  width: 112%;
  height: 112%;
  object-fit: cover;
  filter: blur(3vh) brightness(0.55) saturate(1.2);
}

.featured-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: kenburns 9s ease-out forwards;
}

@keyframes kenburns {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

.fresh-badge {
  position: absolute;
  top: 1.6vh;
  left: 1.6vh;
  padding: 0.6vh 1.6vh;
  border-radius: 3vh;
  background: rgba(12, 33, 28, 0.85);
  color: var(--gold);
  border: 1px solid var(--gold);
  font-family: "Cinzel", serif;
  font-size: 1.8vh;
  letter-spacing: 0.15em;
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 193, 88, 0.5); }
  50% { box-shadow: 0 0 0 1vh rgba(229, 193, 88, 0); }
}

.featured-caption {
  flex: none;
  padding: 1vh 1vh 1.3vh;
  text-align: center;
  font-family: "Great Vibes", cursive;
  font-size: 4.4vh;
  line-height: 1.1;
  color: var(--emerald);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feature-enter-active {
  transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.feature-leave-active {
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.feature-enter-from {
  opacity: 0;
  transform: scale(0.94) rotate(-1.5deg);
}
.feature-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

.featured-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid rgba(229, 193, 88, 0.4);
  border-radius: 1.6vh;
  background: rgba(12, 33, 28, 0.55);
}

.empty-script {
  font-family: "Great Vibes", cursive;
  font-size: 7vh;
  color: var(--gold);
  margin: 0;
  line-height: 1;
}

.empty-caps {
  font-family: "Cinzel", serif;
  font-size: 3vh;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin: 1vh 0 3vh;
}

.empty-qr {
  width: 24vh;
  height: 24vh;
  border-radius: 1.2vh;
  border: 0.6vh solid var(--gold);
}

.empty-hint {
  margin-top: 2vh;
  font-size: 2.6vh;
  font-style: italic;
  opacity: 0.85;
}

/* ---------- PIE ---------- */
.stage-footer {
  grid-area: footer;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
}

.footer-qr {
  width: 11vh;
  height: 11vh;
  border-radius: 1vh;
  border: 0.4vh solid var(--gold);
  box-shadow: 0 0 3vh rgba(229, 193, 88, 0.3);
}

.footer-text p {
  margin: 0;
}

.footer-script {
  font-family: "Great Vibes", cursive;
  font-size: 5vh;
  color: var(--gold);
  line-height: 1;
}

.footer-caps {
  font-family: "Cinzel", serif;
  font-size: 1.9vh;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-top: 0.6vh;
}

.footer-count {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 0;
  font-family: "Cinzel", serif;
  font-size: 1.8vh;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}

.footer-count strong {
  color: var(--gold);
  font-size: 2.6vh;
}

/* Pantallas verticales o pequeñas: destacada arriba, muros abajo */
@media (max-aspect-ratio: 1/1) {
  .stage {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto minmax(0, 1.4fr) minmax(0, 1fr) auto;
    grid-template-areas:
      "header header"
      "featured featured"
      "left right"
      "footer footer";
  }

  .footer-count {
    display: none;
  }
}
</style>
