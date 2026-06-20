import { useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../components/ui/Icon";
import styles from "./admin.module.css";

/* Generic create/edit/delete manager for a single resource collection.
   Driven entirely by the `config` prop so services, reviews, stats and
   features all reuse the same UI and API plumbing. */
export default function ResourceManager({ config, list, setList, onSaved }) {
  const { token } = useAuth();
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);

  const isNew = draft && !list.some((item) => item.id === draft.id);

  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setBusy(true);
    try {
      if (isNew) {
        const row = await api.create(config.resource, draft, token);
        setList([...list, row]);
      } else {
        const row = await api.update(config.resource, draft.id, draft, token);
        setList(list.map((item) => (item.id === draft.id ? row : item)));
      }
      setDraft(null);
      onSaved?.();
    } catch (err) {
      alert(`Could not save: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this item? This can't be undone.")) return;
    try {
      await api.remove(config.resource, id, token);
    } catch {
      /* keep UI consistent even if the row was already gone */
    }
    setList(list.filter((item) => item.id !== id));
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <button className="btn btn--primary" onClick={() => setDraft(config.blank())}>
          <Icon name="plus" size={16} /> Add {config.singular}
        </button>
      </div>

      {draft && (
        <div className={`card ${styles.editor}`}>
          <div className={styles.editorTitle}>
            {isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
          </div>
          <div className={styles.editorGrid}>
            {config.fields.map((field) => (
              <div key={field.key} className={`field ${field.full ? styles.full : ""}`}>
                <label className="field__label">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="input"
                    value={draft[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setField(field.key, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <select
                    className="input"
                    value={draft[field.key] ?? ""}
                    onChange={(e) =>
                      setField(
                        field.key,
                        field.numeric ? Number(e.target.value) : e.target.value
                      )
                    }
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type={field.type === "number" ? "number" : "text"}
                    value={draft[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setField(
                        field.key,
                        field.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <div className={styles.editorActions}>
            <button className="btn btn--primary" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </button>
            <button className="btn btn--ghost" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {list.length === 0 ? (
        <div className={styles.empty}>No {config.resource} yet. Add your first one above.</div>
      ) : (
        <div className={styles.list}>
          {list.map((item) => (
            <div key={item.id} className={`card ${styles.row}`}>
              <div className={styles.rowMain}>
                {config.getIcon && (
                  <span className={styles.rowIcon}>
                    <Icon name={config.getIcon(item)} size={20} />
                  </span>
                )}
                <div style={{ minWidth: 0 }}>
                  <div className={styles.rowPrimary}>{config.getPrimary(item)}</div>
                  {config.getSecondary && (
                    <div className={styles.rowSecondary}>{config.getSecondary(item)}</div>
                  )}
                </div>
              </div>
              <div className={styles.rowActions}>
                <button
                  className={styles.iconBtn}
                  onClick={() => setDraft(item)}
                  aria-label="Edit"
                >
                  <Icon name="edit" size={16} />
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.danger}`}
                  onClick={() => remove(item.id)}
                  aria-label="Delete"
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
