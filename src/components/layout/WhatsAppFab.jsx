import { useData } from "../../context/DataContext";
import { openWhatsApp } from "../../lib/whatsapp";
import Icon from "../ui/Icon";

/* Floating WhatsApp button, always available so a visitor can reach out from
   any page. Opens a pre-filled chat with the company. */
export default function WhatsAppFab() {
  const { company } = useData();
  return (
    <button
      onClick={() =>
        openWhatsApp(company.whatsapp, `Hi ${company.name}, I'd like to ask about a project.`)
      }
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        right: "clamp(16px, 4vw, 28px)",
        bottom: "clamp(16px, 4vw, 28px)",
        width: 56,
        height: 56,
        borderRadius: "var(--radius-full)",
        border: "none",
        cursor: "pointer",
        background: "var(--whatsapp)",
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 14px 30px -8px rgba(30, 190, 93, 0.55)",
        zIndex: 90,
        transition: "transform var(--dur-fast) var(--ease)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Icon name="whatsapp" size={26} />
    </button>
  );
}
