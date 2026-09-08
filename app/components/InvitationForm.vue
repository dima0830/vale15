<template>
  <section class="confirm-section">
    <!-- ENCABEZADO -->
    <header class="title-container">
      <h2 class="script-title">Confirmar</h2>
      <h1 class="main-title">ASISTENCIA</h1>
    </header>

    <form v-if="!submitted" class="rsvp-form" @submit.prevent="confirmAttendance">
      <!-- CAMPO: NOMBRE COMPLETO -->
      <div class="form-group">
        <label for="guest-name" class="form-label">NOMBRE COMPLETO*</label>
        <input
          id="guest-name"
          v-model="guestName"
          type="text"
          required
          class="form-input"
          placeholder="Escribe tu nombre completo"
        />
      </div>

      <!-- CAMPO: NÚMERO MÓVIL (CON MARIPOSA VERDE CLARO) -->
      <div class="form-group field-with-butterfly">
        <img
          src="~/assets/images/mariposa-.png"
          alt=""
          class="butterfly butterfly-phone"
          aria-hidden="true"
        />
        <label for="guest-phone" class="form-label">NÚMERO MÓVIL</label>
        <input
          id="guest-phone"
          v-model="guestPhone"
          type="tel"
          class="form-input"
          placeholder="Ej: 300 123 4567"
        />
      </div>

      <!-- SECCIÓN: ¿ASISTIRÁS? -->
      <div class="form-group field-with-butterfly">
        <p class="form-label-title">¿ASISTIRÁS?</p>
        <div class="pill-options">
          <button
            type="button"
            class="pill-btn"
            :class="{ active: attendance === 'Acepto con mucho gusto' }"
            @click="attendance = 'Acepto con mucho gusto'"
          >
            Acepto con mucho gusto
          </button>
          <button
            type="button"
            class="pill-btn"
            :class="{
              active: attendance === 'Lamentablemente no puedo asistir',
            }"
            @click="attendance = 'Lamentablemente no puedo asistir'"
          >
            Lamentablemente no puedo asistir
          </button>
        </div>
        <!-- MARIPOSA ESMERALDA -->
        <img
          src="~/assets/images/mariposa-.png"
          alt=""
          class="butterfly butterfly-options"
          aria-hidden="true"
        />
      </div>

      <!-- SECCIÓN: ¿CUÁNTOS PASES USARÁS? -->
      <div class="form-group">
        <p class="form-label-title">
          SEGÚN TU PASE ASIGNADO<br />
          ¿CUÁNTOS PASES USARÁS?
        </p>
        <div class="square-options-row">
          <button
            v-for="num in [1, 2, 3]"
            :key="num"
            type="button"
            class="square-btn-row"
            :class="{ active: passesCount === num }"
            @click="passesCount = num"
          >
            <span class="checkbox-box">
              <span v-if="passesCount === num" class="checkmark">✓</span>
            </span>
            <span class="square-label"
              >{{ num }} {{ num === 1 ? "pase" : "pases" }}</span
            >
          </button>
        </div>
      </div>

      <!-- BOTÓN ENVIAR -->
      <button class="button-submit" type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "ENVIANDO..." : "ENVIAR 💚" }}
      </button>
    </form>

    <!-- MENSAJE DE CONFIRMACIÓN -->
    <div v-else class="confirmation-message">
      <span class="confirmation-icon" aria-hidden="true">✓</span>
      <h2 class="script-title">¡Gracias!</h2>
      <h3 class="main-title confirmation-subtitle">
        {{ isAttending ? "CONFIRMACIÓN RECIBIDA" : "RESPUESTA REGISTRADA" }}
      </h3>
      <p class="confirmation-detail">
        <span v-if="isAttending">
          Hemos recibido tu confirmación, <strong>{{ submittedName }}</strong>,
          con {{ submittedPasses }}
          {{ submittedPasses === 1 ? "pase" : "pases" }}. ¡Nos vemos pronto!
        </span>
        <span v-else>
          Gracias por avisarnos, <strong>{{ submittedName }}</strong>.
          Lamentamos que no puedas acompañarnos.
        </span>
      </p>
    </div>

    <!-- MENSAJES DE ESTADO -->
    <p v-if="confirmationError" class="confirmation-error">
      {{ confirmationError }}
    </p>

    <!-- SECCIÓN INFERIOR: TE ESPERAMOS & FLOR DE LOTO -->
    <div class="footer-decoration">
      <p class="footer-title">Te esperamos</p>
      <img src="~/assets/images/loto.png" alt="Flor de loto" class="loto-img" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const guestName = ref("");
const guestPhone = ref("");
const attendance = ref("");
const passesCount = ref<number | null>(null);
const confirmationError = ref("");

const isSubmitting = ref(false);
const submitted = ref(false);
const submittedName = ref("");
const submittedPasses = ref(0);

const isAttending = computed(() => attendance.value === "Acepto con mucho gusto");

async function confirmAttendance() {
  if (!guestName.value.trim()) {
    confirmationError.value = "Por favor escribe tu nombre completo.";
    return;
  }
  if (!attendance.value) {
    confirmationError.value = "Por favor selecciona si asistirás.";
    return;
  }
  if (!passesCount.value) {
    confirmationError.value = "Por favor selecciona cuántos pases usarás.";
    return;
  }

  confirmationError.value = "";
  isSubmitting.value = true;

  try {
    await $fetch("/api/rsvp", {
      method: "POST",
      body: {
        fullName: guestName.value.trim(),
        phone: guestPhone.value.trim(),
        attendance: attendance.value,
        passesCount: passesCount.value,
      },
    });
    submittedName.value = guestName.value.trim();
    submittedPasses.value = passesCount.value;
    submitted.value = true;
  } catch (error) {
    confirmationError.value =
      "No pudimos guardar tu confirmación. Por favor intenta nuevamente.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;1,400&display=swap");

.confirm-section {
  position: relative;
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  padding: 30px 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f3f9f1;
  text-align: center;
  color: #1c4b3c;
  overflow: hidden;
}

/* ENCABEZADOS */
.title-container {
  margin-bottom: 25px;
  width: 100%;
}

.script-title {
  font-family: "Great Vibes", "Cormorant Garamond", cursive;
  font-size: 2.8rem;
  color: #c9a45c;
  font-weight: 400;
  margin: 0;
  line-height: 0.9;
}

.main-title {
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #1c4b3c;
  letter-spacing: 2px;
  margin: -2px 0 0 0;
}

/* FORMULARIO */
.rsvp-form {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: left;
}

.form-group {
  width: 100%;
  box-sizing: border-box;
}

/* TÍTULOS DE ETIQUETAS (mínimo 12px) */
.form-label,
.form-label-title {
  display: block;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 12px;
  font-weight: 700;
  color: #1c4b3c;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
  line-height: 1.3;
}

/* INPUTS (Open Sans estricto para texto digitado y placeholder) */
.form-input {
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  border: 1px solid #d4c59a;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.65);
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: #1c4b3c;
  box-sizing: border-box;
  outline: none;
}

.form-input::placeholder {
  font-family: "Open Sans", sans-serif;
  color: #7b988c;
  font-size: 13px;
}

.form-input:focus {
  border-color: #1c4b3c;
  background-color: #ffffff;
}

/* MARIPOSAS */
.field-with-butterfly {
  position: relative;
}

.butterfly {
  position: absolute;
  height: auto;
  pointer-events: none;
  z-index: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
}

.butterfly-phone {
  width: 32px;
  top: 15px;
  left: -18px;
  transform: rotate(-15deg);
}

.butterfly-options {
  width: 36px;
  bottom: -10px;
  right: -10px;
  transform: rotate(10deg);
}

/* BOTONES ASISTENCIA */
.pill-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.pill-btn {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: #e2ede0;
  color: #2d5548;
  font-family: "Cormorant Garamond", serif;
  font-size: 15px;
  font-style: italic;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.pill-btn.active {
  background-color: #cce0c9;
  color: #1c4b3c;
  border-color: #1c4b3c;
}

/* PASES HORIZONTALES */
.square-options-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}

.square-btn-row {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 4px;
  border: 1px solid transparent;
  border-radius: 8px;
  background-color: #e2ede0;
  color: #2d5548;
  font-family: "Cormorant Garamond", serif;
  font-size: 14px;
  font-style: italic;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.square-btn-row.active {
  background-color: #cce0c9;
  color: #1c4b3c;
  border-color: #1c4b3c;
}

.checkbox-box {
  width: 16px;
  height: 16px;
  border: 1.5px solid #1c4b3c;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.square-btn-row.active .checkbox-box {
  background-color: #1c4b3c;
}

.checkmark {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}

.square-label {
  line-height: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* BOTÓN DE ENVÍO */
.button-submit {
  width: 100%;
  margin-top: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background-color: #235848;
  color: #ffffff;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 10px rgba(28, 75, 60, 0.25);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.button-submit:hover {
  background-color: #1a4337;
  transform: translateY(-1px);
}

.confirmation-error {
  color: #d9534f;
  font-size: 13px;
  margin-top: 10px;
}

/* MENSAJE DE CONFIRMACIÓN */
.confirmation-message {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 10px 6px;
  animation: fade-in-up 0.4s ease;
}

.confirmation-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 6px;
  border-radius: 50%;
  background-color: #cce0c9;
  border: 1.5px solid #1c4b3c;
  color: #1c4b3c;
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirmation-subtitle {
  margin: -2px 0 4px 0;
}

.confirmation-detail {
  max-width: 300px;
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #2d5548;
}

.confirmation-detail strong {
  color: #1c4b3c;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* SECCIÓN INFERIOR */
.footer-decoration {
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.footer-title {
  font-family: "Great Vibes", "Cormorant Garamond", cursive;
  font-size: 3.2rem;
  color: #c9a45c;
  margin: 0 0 10px 0;
  font-weight: 400;
  line-height: 1;
}

.loto-img {
  width: 110px;
  height: auto;
  display: block;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}
</style>
