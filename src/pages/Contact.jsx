import { useState } from "react";
import { useData } from "../context/DataContext";
import { openWhatsApp } from "../lib/whatsapp";
import Heading from "../components/ui/Heading";
import Reveal from "../components/ui/Reveal";
import Icon from "../components/ui/Icon";

export default function Contact() {
  const { company, services } = useData();
  const [form, setForm] = useState({
    name: "",
    service: services[0]?.title || "",
    message: "",
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const text =
      `Hi ${company.name}, my name is ${form.name || "—"}.\n` +
      `Service: ${form.service}\n` +
      `Details: ${form.message || "—"}`;
    openWhatsApp(company.whatsapp, text);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="grid cols-2" style={{ alignItems: "start", gap: "var(--space-8)" }}>
          <Reveal>
            <div>
              <div className="eyebrow eyebrow--rule">Contact</div>
              <Heading bold="Let's build" thin="something together" />
              <p className="section-lead" style={{ marginBottom: "var(--space-6)" }}>
                Fill this in and it opens WhatsApp with your message ready to send —
                nothing is stored, you're chatting directly with us.
              </p>
              <div className="cluster text-secondary" style={{ gap: "var(--space-4)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="whatsapp" size={18} /> +{company.whatsapp}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Icon name="mail" size={18} /> {company.email}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form className="card" onSubmit={submit}>
              <div className="field">
                <label className="field__label" htmlFor="name">Your name</label>
                <input
                  id="name"
                  className="input"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Kasun Perera"
                  required
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="service">Service</label>
                <select
                  id="service"
                  className="input"
                  value={form.service}
                  onChange={update("service")}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Other / not sure">Other / not sure</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="message">Project details</label>
                <textarea
                  id="message"
                  className="input"
                  value={form.message}
                  onChange={update("message")}
                  placeholder="A short description of what you need…"
                />
              </div>
              <button type="submit" className="btn btn--whatsapp btn--block">
                <Icon name="whatsapp" size={18} /> Send via WhatsApp
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
