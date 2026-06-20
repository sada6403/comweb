/* Fallback demo content. Used until the backend responds, so the site always
   renders something sensible (and works fully offline in development). */

export const FALLBACK_WHATSAPP = "94244335099";

export const DEMO_COMPANY = {
  name: "NF Software Solutions",
  tagline: "Software, built around how your business actually runs.",
  about:
    "NF Software Solutions is a team of developers and designers building websites, apps, and internal tools for businesses that are tired of off-the-shelf software that almost fits. Clear scope, direct communication, and code that's built to last.",
  email: "info@nfplantation.com",
  location: "No: 150, Housing Scheme, Kannakipuram West, Kannakipuram, Kilinochchi.",
  whatsapp: FALLBACK_WHATSAPP,
  facebook: "",
  instagram: "",
  linkedin: "",
  logo_url: "/images/logo.jpg",
};

export const DEMO_SERVICES = [
  { id: "s1", title: "Web development", summary: "Business websites and web apps built with React, Node, or Laravel.", price_label: "From LKR 25,000", icon: "code" },
  { id: "s2", title: "UI / UX design", summary: "Wireframes, prototypes, and full visual design that's easy to use.", price_label: "From LKR 12,000", icon: "layout" },
  { id: "s3", title: "Mobile app development", summary: "Android and cross-platform apps for small businesses and startups.", price_label: "From LKR 40,000", icon: "device-mobile" },
  { id: "s4", title: "POS & data systems", summary: "Point-of-sale software and structured data-entry tools.", price_label: "From LKR 18,000", icon: "database" },
  { id: "s5", title: "Brand & graphic design", summary: "Logos, social posters, flyers, and a simple, consistent style guide.", price_label: "From LKR 5,000", icon: "palette" },
  { id: "s6", title: "Custom software & ERP", summary: "Internal dashboards and tools to replace messy spreadsheets.", price_label: "Custom pricing", icon: "code" },
];

export const DEMO_STATS = [
  { id: "st1", number: 40, suffix: "+", label: "Projects delivered" },
  { id: "st2", number: 98, suffix: "%", label: "Client satisfaction" },
  { id: "st3", number: 24, suffix: "h", label: "Avg. response time" },
];

export const DEMO_FEATURES = [
  { id: "f1", text: "Direct communication — talk to the people actually building your project." },
  { id: "f2", text: "Fixed-scope quotes before any work starts, with no surprise costs." },
  { id: "f3", text: "Built with modern, maintainable tech: React, Node.js, and Laravel." },
];

export const DEMO_REVIEWS = [
  { id: "r1", name: "Kasun Perera", role: "Owner, Perera Hardware", service: "Web development", rating: 5, text: "They built our business site in under two weeks and it actually loads fast on mobile, unlike our old one. Communication on WhatsApp made the whole process easy to follow." },
  { id: "r2", name: "Nadeesha Fernando", role: "Founder, Thaaragai Boutique", service: "Brand & graphic design", rating: 5, text: "Our posters finally look consistent and professional. They understood our brand colours immediately and turned around designs within a day each time." },
  { id: "r3", name: "Ahamed Rizvi", role: "Manager, Rizvi Auto Care", service: "POS & data systems", rating: 4, text: "The POS system handles our daily billing without any issues. Took a little time to train staff, but support was responsive throughout." },
  { id: "r4", name: "Dilani Wickramasinghe", role: "Director, Wickrama Real Estate", service: "UI / UX design", rating: 5, text: "Got an interface that actually fits how our agents work, not a generic template. They explained their design choices clearly, which I appreciated." },
  { id: "r5", name: "Tharindu Jayasuriya", role: "Co-founder, Jaysu Mobile", service: "Mobile app development", rating: 5, text: "Built our delivery-tracking app exactly to spec, and were upfront about what was realistic within our budget instead of overpromising." },
  { id: "r6", name: "Sherine de Silva", role: "Marketing lead, Silva Boutique", service: "Custom software & ERP", rating: 4, text: "The internal dashboard replaced three spreadsheets and saves us hours every week. Would happily work with them again." },
];
