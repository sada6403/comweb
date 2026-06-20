import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import styles from "./admin.module.css";

const FIELDS = [
  ["name", "Company name"],
  ["tagline", "Tagline"],
  ["email", "Email"],
  ["location", "Location"],
  ["whatsapp", "WhatsApp number (digits only)"],
  ["facebook", "Facebook link"],
  ["instagram", "Instagram link"],
  ["linkedin", "LinkedIn link"],
];

/* Editor for the singleton company record, including a logo upload that is
   stored inline as a data URL. */
export default function CompanyEditor({ company, setCompany, onSaved }) {
  const { token } = useAuth();
  const [draft, setDraft] = useState(company);
  const [busy, setBusy] = useState(false);

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const onLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setField("logo_url", ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setBusy(true);
    try {
      await api.updateCompany(draft, token);
      setCompany(draft);
      onSaved?.();
    } catch (err) {
      alert(`Could not save: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div className={styles.logoRow}>
        {draft.logo_url ? (
          <img src={draft.logo_url} alt="Logo preview" className={styles.logoPreview} />
        ) : (
          <span className={styles.logoPlaceholder}>
            <Icon name="palette" size={22} />
          </span>
        )}
        <div>
          <input type="file" accept="image/*" onChange={onLogo} style={{ fontSize: "var(--fs-sm)" }} />
          {draft.logo_url && (
            <div style={{ marginTop: 6 }}>
              <button className={styles.removeLink} onClick={() => setField("logo_url", "")}>
                Remove logo
              </button>
            </div>
          )}
        </div>
      </div>

      {FIELDS.map(([key, label]) => (
        <div className="field" key={key}>
          <label className="field__label">{label}</label>
          <input
            className="input"
            value={draft[key] ?? ""}
            onChange={(e) => setField(key, e.target.value)}
          />
        </div>
      ))}

      <div className="field">
        <label className="field__label">About</label>
        <textarea
          className="input"
          value={draft.about ?? ""}
          onChange={(e) => setField("about", e.target.value)}
        />
      </div>

      <button className="btn btn--primary" onClick={save} disabled={busy}>
        {busy ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
