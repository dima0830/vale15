import { INVITADOS_COOKIE } from "../../utils/auth";

export default defineEventHandler((event) => {
  deleteCookie(event, INVITADOS_COOKIE, { path: "/" });
  return { ok: true };
});
