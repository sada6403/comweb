import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { ABOUT_IMAGES } from "../lib/images";
import Hero from "../components/sections/Hero";
import ServiceCard from "../components/sections/ServiceCard";
import ReviewCard from "../components/sections/ReviewCard";
import CTASection from "../components/sections/CTASection";
import FeatureList from "../components/sections/FeatureList";
import SectionHeader from "../components/ui/SectionHeader";
import Heading from "../components/ui/Heading";
import Icon from "../components/ui/Icon";
import Reveal, { RevealGroup, RevealItem } from "../components/ui/Reveal";

export default function Home() {
  const { services, reviews, features } = useData();

  return (
    <>
      <Hero />

      {/* Services */}
      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            eyebrow="What we build"
            bold="Services"
            thin="that fit the way you work"
            lead="From websites and apps to internal tools and branding — pick what you need, or ask us where to start."
            link={{ to: "/services", label: "All services" }}
          />
          <RevealGroup className="grid cols-auto">
            {services.slice(0, 6).map((s) => (
              <RevealItem key={s.id}>
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Why choose us — dark band */}
      <section className="section section--dark">
        <div className="container">
          <div className="grid cols-2" style={{ alignItems: "center", gap: "var(--space-8)" }}>
            <Reveal>
              <div className="photo-frame">
                <img src={ABOUT_IMAGES[0]} alt="Our team at work" loading="lazy" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <div className="eyebrow eyebrow--rule">Why choose us</div>
                <Heading bold="The right" thin="partner for your software" />
                <p className="section-lead" style={{ marginBottom: "var(--space-6)" }}>
                  We work like an in-house team: clear scope, honest timelines, and software
                  that's built to last — not just to demo.
                </p>
                <FeatureList features={features} invert />
                <Link to="/about" className="btn btn--primary" style={{ marginTop: "var(--space-6)" }}>
                  More about us
                  <span className="btn__chip"><Icon name="arrow" size={14} /></span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Client reviews"
              bold="Trusted"
              thin="by businesses like yours"
              link={{ to: "/reviews", label: "All reviews" }}
            />
            <RevealGroup className="grid cols-3">
              {reviews.slice(0, 3).map((r) => (
                <RevealItem key={r.id}>
                  <ReviewCard review={r} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
