/** Placeholder production domain — update when the real domain is confirmed. */
export const SITE_URL = "https://www.fluxoflx.com.br";
export const SITE_NAME = "Fluxo FLX";

const DEFAULT_WHATSAPP_MESSAGE = "Olá! Vim pelo site da Fluxo FLX e gostaria de tirar uma dúvida.";

/** The number itself now lives in the store settings (editable at /admin/configuracoes) — this just builds the link. */
export function getWhatsAppLink(whatsappNumber: string, message: string = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
