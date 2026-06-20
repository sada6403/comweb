import { useData } from "../context/DataContext";
import { ABOUT_IMAGES } from "../lib/images";
import FeatureList from "../components/sections/FeatureList";
import CTASection from "../components/sections/CTASection";
import Heading from "../components/ui/Heading";
import Reveal from "../components/ui/Reveal";
import Icon from "../components/ui/Icon";

export default function About() {
  const { company, features } = useData();

  const contact = [
    ["mail", "Email", company.email],
    ["pin", "Location", company.location],
    ["whatsapp", "WhatsApp", `+${company.whatsapp}`],
  ];

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="grid cols-2" style={{ alignItems: "center", gap: "var(--space-8)" }}>
            <Reveal>
              <div style={{ position: "relative", paddingRight: 40, paddingBottom: 40 }}>
                <div className="photo-frame">
                  <img src={ABOUT_IMAGES[0]} alt={`${company.name} team`} loading="lazy" />
                </div>
                <img
                  src={ABOUT_IMAGES[1]}
                  alt="Working session"
                  loading="lazy"
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: "48%",
                    borderRadius: "var(--radius)",
                    border: "5px solid var(--bg)",
                    boxShadow: "var(--shadow-lg)",
                  }}
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div>
                <div className="eyebrow eyebrow--rule">About</div>
                <Heading bold="About" thin={company.name} />
                <p className="section-lead" style={{ marginBottom: "var(--space-6)" }}>
                  {company.about}
                </p>
                <FeatureList features={features} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt section--tight">
        <div className="container">
          <Reveal>
            <div className="grid cols-3">
              {contact.map(([icon, label, value]) => (
                <div
                  key={label}
                  className="card"
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--accent-soft)",
                      color: "var(--accent-strong)",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={icon} size={20} />
                  </span>
                  <div>
                    <div className="text-muted" style={{ fontSize: "var(--fs-sm)" }}>{label}</div>
                    <div style={{ fontWeight: 600 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
