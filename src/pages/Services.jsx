import { useData } from "../context/DataContext";
import ServiceCard from "../components/sections/ServiceCard";
import CTASection from "../components/sections/CTASection";
import Heading from "../components/ui/Heading";
import Reveal, { RevealGroup, RevealItem } from "../components/ui/Reveal";

export default function Services() {
  const { services } = useData();

  return (
    <>
      <section className="section">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: "48rem", marginBottom: "var(--space-7)" }}>
              <div className="eyebrow eyebrow--rule">Services</div>
              <Heading bold="What" thin="we offer" />
              <p className="section-lead">
                Pick a service and send us the details on WhatsApp — we'll reply with a quote,
                usually within a day. Not sure what you need? Just ask.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="grid cols-auto">
            {services.map((s) => (
              <RevealItem key={s.id}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection bold="Ready to" thin="get started?" />
    </>
  );
}
