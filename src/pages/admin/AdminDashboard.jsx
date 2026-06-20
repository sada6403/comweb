import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { ICON_OPTIONS } from "../../lib/constants";
import ResourceManager from "./ResourceManager";
import CompanyEditor from "./CompanyEditor";
import Icon from "../../components/ui/Icon";
import styles from "./admin.module.css";

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({
  value: n,
  label: `${n} star${n !== 1 ? "s" : ""}`,
}));

const CONFIGS = {
  services: {
    resource: "services",
    singular: "service",
    blank: () => ({ id: `s${Date.now()}`, title: "", summary: "", price_label: "", icon: "code" }),
    fields: [
      { key: "title", label: "Title" },
      { key: "price_label", label: "Price label", placeholder: "From LKR 20,000" },
      { key: "summary", label: "Summary", type: "textarea", full: true },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, full: true },
    ],
    getPrimary: (s) => s.title,
    getSecondary: (s) => s.price_label,
    getIcon: (s) => s.icon,
  },
  reviews: {
    resource: "reviews",
    singular: "review",
    blank: () => ({ id: `r${Date.now()}`, name: "", role: "", service: "", rating: 5, text: "" }),
    fields: [
      { key: "name", label: "Customer name" },
      { key: "role", label: "Role / business", placeholder: "Owner, ABC Traders" },
      { key: "service", label: "Service", placeholder: "Web development" },
      { key: "rating", label: "Rating", type: "select", numeric: true, options: RATING_OPTIONS },
      { key: "text", label: "Review text", type: "textarea", full: true },
    ],
    getPrimary: (r) => r.name,
    getSecondary: (r) => r.text,
  },
  stats: {
    resource: "stats",
    singular: "stat",
    blank: () => ({ id: `st${Date.now()}`, number: 0, suffix: "", label: "" }),
    fields: [
      { key: "number", label: "Number", type: "number" },
      { key: "suffix", label: "Suffix (+, %, h)" },
      { key: "label", label: "Label", full: true },
    ],
    getPrimary: (s) => `${s.number}${s.suffix}`,
    getSecondary: (s) => s.label,
  },
  features: {
    resource: "features",
    singular: "point",
    blank: () => ({ id: `f${Date.now()}`, text: "" }),
    fields: [{ key: "text", label: "About point", type: "textarea", full: true }],
    getPrimary: (f) => f.text,
  },
};

const TABS = [
  ["services", "Services"],
  ["reviews", "Reviews"],
  ["stats", "Stats"],
  ["features", "About points"],
  ["company", "Company info"],
];

export default function AdminDashboard() {
  const data = useData();
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("services");
  const [saved, setSaved] = useState(false);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const onLogout = () => {
    logout();
    navigate("/admin");
  };

  const listProps = {
    services: { list: data.services, setList: data.setServices },
    reviews: { list: data.reviews, setList: data.setReviews },
    stats: { list: data.stats, setList: data.setStats },
    features: { list: data.features, setList: data.setFeatures },
  };

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow">Admin panel</span>
            <h1 className={styles.headTitle}>Manage {data.company.name}</h1>
          </div>
          <div className={styles.headMeta}>
            {saved && <span className={styles.saved}>Saved ✓</span>}
            <span className={styles.email}>{admin?.email}</span>
            <button className="btn btn--ghost btn--sm" onClick={onLogout}>
              <Icon name="logout" size={15} /> Log out
            </button>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              className={`${styles.tab} ${tab === key ? styles.active : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "company" ? (
          <CompanyEditor
            company={data.company}
            setCompany={data.setCompany}
            onSaved={flashSaved}
          />
        ) : (
          <ResourceManager
            config={CONFIGS[tab]}
            list={listProps[tab].list}
            setList={listProps[tab].setList}
            onSaved={flashSaved}
          />
        )}
      </div>
    </div>
  );
}
