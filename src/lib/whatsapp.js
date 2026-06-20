/* Opens WhatsApp (app or web) with a pre-filled message. No data is stored —
   the visitor chats with the company directly. */
export function openWhatsApp(number, message) {
  const clean = String(number || "").replace(/[^\d]/g, "");
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
