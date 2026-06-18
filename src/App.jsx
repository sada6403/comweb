import React, { useState, useEffect, useCallback, useRef } from "react";

/* =========================================================================
   YOURCOMPANY — Service business website (3D / animated tech edition)
   - Public site: Home / Services / About / Contact
   - 3D animated particle-network background (Three.js, canvas-based)
   - Glassmorphism cards, mouse-tilt 3D hover, glow accents, scroll reveals
   - Admin panel: edit services + company info (Supabase-backed)
   - Contact/order forms redirect to WhatsApp with a pre-filled message
   - Drop in your Supabase URL + anon key below to go live.
   ========================================================================= */

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
const WHATSAPP_NUMBER = "94770000000"; // country code + number, no + or spaces

/* ---------- API helper ---------- */
async function api(path, { method = "GET", body, headers = {}, token } = {}) {
  const reqHeaders = { "Content-Type": "application/json", ...headers };
  if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/${path}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (method === "DELETE" && res.ok) return null;
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

/* ---------- fallback demo data (used until Supabase is connected) ---------- */
const DEMO_SERVICES = [
  {
    id: "s1",
    title: "Web development",
    summary: "Business websites and web apps built with React, PHP, or Laravel.",
    price_label: "From LKR 25,000",
    icon: "code",
  },
  {
    id: "s2",
    title: "UI / UX design",
    summary: "Wireframes, prototypes, and full visual design in Figma or Canva.",
    price_label: "From LKR 12,000",
    icon: "layout",
  },
  {
    id: "s3",
    title: "Mobile app development",
    summary: "Android and cross-platform apps for small businesses and startups.",
    price_label: "From LKR 40,000",
    icon: "device-mobile",
  },
  {
    id: "s4",
    title: "POS & data entry systems",
    summary: "Point-of-sale software and structured data entry tools.",
    price_label: "From LKR 18,000",
    icon: "database",
  },
  {
    id: "s5",
    title: "Graphic design",
    summary: "Social media posters, flyers, business cards, banners, and brand assets.",
    price_label: "From LKR 1,500",
    icon: "palette",
  },
  {
    id: "s6",
    title: "Logo & brand identity",
    summary: "Logo design, brand colors, and a simple style guide for your business.",
    price_label: "From LKR 5,000",
    icon: "palette",
  },
  {
    id: "s7",
    title: "Social media management",
    summary: "Content calendars, post design, and page setup for Facebook & Instagram.",
    price_label: "From LKR 8,000 / month",
    icon: "layout",
  },
  {
    id: "s8",
    title: "Video editing",
    summary: "Reels, promo videos, and short-form edits for social media marketing.",
    price_label: "From LKR 3,000",
    icon: "device-mobile",
  },
];

const DEMO_COMPANY = {
  name: "YourCompany",
  tagline: "Software, built around how your business actually runs.",
  about:
    "We are a small team of developers and designers based in Sri Lanka, building websites, apps, and internal tools for businesses that are tired of off-the-shelf software that almost fits.",
  email: "hello@yourcompany.lk",
  location: "Colombo, Sri Lanka",
  whatsapp: WHATSAPP_NUMBER,
};

const DEMO_REVIEWS = [
  {
    id: "r1",
    name: "Kasun Perera",
    role: "Owner, Perera Hardware",
    service: "Web development",
    rating: 5,
    text: "They built our business site in under two weeks and it actually loads fast on mobile, unlike our old one. Communication on WhatsApp made the whole process easy to follow.",
  },
  {
    id: "r2",
    name: "Nadeesha Fernando",
    role: "Founder, Thaaragai Boutique",
    service: "Graphic design",
    rating: 5,
    text: "Our Facebook posters finally look consistent and professional. They understood our brand colors immediately and turned around designs within a day each time.",
  },
  {
    id: "r3",
    name: "Ahamed Rizvi",
    role: "Manager, Rizvi Auto Care",
    service: "POS & data entry systems",
    rating: 4,
    text: "The POS system they set up handles our daily billing without any issues. Took a little time to get our staff used to it, but support was responsive throughout.",
  },
  {
    id: "r4",
    name: "Dilani Wickramasinghe",
    role: "Director, Wickrama Real Estate",
    service: "Logo & brand identity",
    rating: 5,
    text: "Got a logo and brand colors that actually fit a real estate business, not a generic template. They explained their design choices clearly, which I appreciated.",
  },
  {
    id: "r5",
    name: "Tharindu Jayasuriya",
    role: "Co-founder, Jaysu Mobile",
    service: "Mobile app development",
    rating: 5,
    text: "Built our delivery tracking app exactly to spec, and they were upfront about what was realistic within our budget instead of overpromising.",
  },
  {
    id: "r6",
    name: "Sherine de Silva",
    role: "Marketing lead, Silva Boutique",
    service: "Social media management",
    rating: 4,
    text: "Our page engagement improved noticeably once they took over the content calendar. Would like a bit more variety in post formats going forward.",
  },
];

/* ---------- WhatsApp helper ---------- */
function openWhatsApp(number, message) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* =============================== ICONS =============================== */
const ICONS = {
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18l-5-6 5-6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  ),
  "device-mobile": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" strokeLinecap="round" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c2.3 0 4.1-1.8 4.1-4.1C21.5 6 17.2 2 12 2z" />
      <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.62 1.45 5.14L2 22l5.1-1.55a9.85 9.85 0 0 0 4.93 1.32h.01c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.78 14.06c-.25.7-1.43 1.34-1.97 1.42-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.16-4.93-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .54.01.17.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.33.02.52-.09.19-.14.31-.28.48-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.74 1.22 1.59 1.97 1.1.98 2.02 1.28 2.31 1.42.29.14.46.12.63-.05.17-.17.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.63.77 1.91.91.28.14.46.21.53.33.07.12.07.69-.18 1.39z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.77l-6.18 3.74L7 14.63l-5-4.87 6.91-1L12 2.5z" />
    </svg>
  ),
  quote: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H4.5c.1-2 1.7-3.5 3.67-3.5V6zm9.66 0A5.17 5.17 0 0 0 11.66 11.17V18h6.83v-6.83h-4.33c.1-2 1.7-3.5 3.67-3.5V6z" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
const Icon = ({ name, size = 20 }) => (
  <span style={{ width: size, height: size, display: "inline-flex", flexShrink: 0 }}>{ICONS[name] || ICONS.code}</span>
);

/* =============================== 3D PARTICLE NETWORK BACKGROUND =============================== */
/* =============================== 3D DEVICE BUILDERS (realistic laptop + phone) =============================== */
function buildLaptop(THREE, accentHex) {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x9aa6a0, metalness: 0.75, roughness: 0.32 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1f1c, metalness: 0.4, roughness: 0.5 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x06150c, metalness: 0.1, roughness: 0.15, emissive: 0x06150c });
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x2a302c, metalness: 0.3, roughness: 0.6 });
  const accentMat = new THREE.MeshStandardMaterial({
    color: accentHex,
    emissive: accentHex,
    emissiveIntensity: 0.9,
    metalness: 0.2,
    roughness: 0.3,
  });

  // base / keyboard deck
  const base = new THREE.Mesh(new THREE.BoxGeometry(14, 0.45, 9.4), bodyMat);
  base.position.y = 0;
  group.add(base);

  // keyboard recess
  const deck = new THREE.Mesh(new THREE.BoxGeometry(12.6, 0.06, 6.6), darkMat);
  deck.position.set(0, 0.25, -0.6);
  group.add(deck);

  // individual key rows (simple grid of small boxes for realism)
  const keyGeo = new THREE.BoxGeometry(0.62, 0.1, 0.62);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 13; col++) {
      const key = new THREE.Mesh(keyGeo, keyMat);
      key.position.set(-5.6 + col * 0.92, 0.3, -2.5 + row * 0.75);
      group.add(key);
    }
  }

  // trackpad
  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.05, 2.4), new THREE.MeshStandardMaterial({ color: 0x3a423d, metalness: 0.5, roughness: 0.25 }));
  trackpad.position.set(0, 0.27, 3.0);
  group.add(trackpad);

  // hinge bar
  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 13.6, 16), darkMat);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0.25, -4.55);
  group.add(hinge);

  // screen group (lid) — rotates open around hinge
  const lid = new THREE.Group();
  lid.position.set(0, 0.25, -4.55);

  const lidBack = new THREE.Mesh(new THREE.BoxGeometry(14, 9.2, 0.35), bodyMat);
  lidBack.position.set(0, 4.6, -0.18);
  lid.add(lidBack);

  // logo on lid back
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), accentMat);
  logo.position.set(0, 4.6, -0.36);
  logo.rotation.y = Math.PI;
  lid.add(logo);

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(13.2, 8.5, 0.12), darkMat);
  bezel.position.set(0, 4.6, 0.02);
  lid.add(bezel);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.2, 7.5), screenMat);
  screen.position.set(0, 4.6, 0.09);
  lid.add(screen);

  // screen glow content (simulated UI lines)
  const lineMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.4 });
  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(6 - i * 1.1, 0.18), lineMat);
    line.position.set(-2.4 + i * 0.3, 6.3 - i * 0.85, 0.1);
    lid.add(line);
  }
  const cursorBlock = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.6 }));
  cursorBlock.position.set(-4.6, 2.0, 0.1);
  lid.add(cursorBlock);

  // webcam dot
  const cam = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), new THREE.MeshStandardMaterial({ color: 0x050a08 }));
  cam.position.set(0, 8.55, 0.1);
  lid.add(cam);

  lid.rotation.x = -1.15; // open angle
  group.add(lid);

  // side ports (USB-C notches)
  const portMat = new THREE.MeshStandardMaterial({ color: 0x0c0f0d, metalness: 0.6, roughness: 0.4 });
  [-6.9, 6.9].forEach((x) => {
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.5), portMat);
    port.position.set(x, 0.05, -3.5);
    group.add(port);
  });

  group.scale.setScalar(0.34);
  return group;
}

function buildPhone(THREE, accentHex) {
  const group = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x8d9a93, metalness: 0.85, roughness: 0.25 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x06150c, metalness: 0.1, roughness: 0.15, emissive: 0x040f09 });
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 8.6, 0.42), frameMat);
  bezel.position.set(0, 0, 0);
  group.add(bezel);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 8.0), screenMat);
  screen.position.set(0, 0, 0.22);
  group.add(screen);

  // notch / camera bump
  const notch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0x050a08 }));
  notch.rotation.z = Math.PI / 2;
  notch.position.set(0, 3.55, 0.24);
  group.add(notch);

  // home indicator
  const homeBar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.05), new THREE.MeshStandardMaterial({ color: 0x4a554f }));
  homeBar.position.set(0, -3.7, 0.24);
  group.add(homeBar);

  // glowing UI elements on phone screen
  const lineMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.4 });
  const appIconGeo = new THREE.BoxGeometry(0.7, 0.7, 0.02);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const icon = new THREE.Mesh(appIconGeo, lineMat);
      icon.position.set(-1.1 + col * 1.1, 1.6 - row * 1.1, 0.24);
      group.add(icon);
    }
  }

  // side buttons
  const btnMat = new THREE.MeshStandardMaterial({ color: 0x5e6a64, metalness: 0.7, roughness: 0.3 });
  const volUp = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.18), btnMat);
  volUp.position.set(-2.13, 1.4, 0);
  group.add(volUp);
  const volDown = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.18), btnMat);
  volDown.position.set(-2.13, 0.3, 0);
  group.add(volDown);
  const power = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.9, 0.18), btnMat);
  power.position.set(2.13, 1.0, 0);
  group.add(power);

  // rear camera bump (visible when rotated)
  const camRing = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0x14181a, metalness: 0.6, roughness: 0.3 }));
  camRing.rotation.x = Math.PI / 2;
  camRing.position.set(-1.2, 2.8, -0.23);
  group.add(camRing);
  const lensMat = new THREE.MeshStandardMaterial({ color: 0x0a0e0c, metalness: 0.9, roughness: 0.1 });
  [[-1.45, 3.05], [-0.95, 3.05], [-1.45, 2.55]].forEach(([x, y]) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, -0.26);
    group.add(lens);
  });

  group.scale.setScalar(0.85);
  return group;
}

function DeviceScene() {
  const mountRef = useRef(null);
  const threeReady = useThreeLoader();

  useEffect(() => {
    if (!threeReady || !window.THREE) return;
    const THREE = window.THREE;
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 2.5, 16);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // lighting for realism
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x3ee08c, 0.5);
    fillLight.position.set(-10, 2, -6);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x3ee08c, 1.2, 40);
    rimLight.position.set(0, 4, -8);
    scene.add(rimLight);

    const rig = new THREE.Group();
    scene.add(rig);

    const laptop = buildLaptop(THREE, 0x3ee08c);
    laptop.position.set(-3.4, -1.6, 0);
    rig.add(laptop);

    const phone = buildPhone(THREE, 0x3ee08c);
    phone.position.set(4.6, -1.2, 1.5);
    phone.rotation.y = -0.35;
    rig.add(phone);

    // drag-to-rotate interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = -0.25;
    let targetRotX = 0.05;
    let rotY = targetRotY;
    let rotX = targetRotX;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      targetRotY += dx * 0.006;
      targetRotX += dy * 0.004;
      targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX));
    };
    const onPointerUp = () => {
      isDragging = false;
    };
    const dom = renderer.domElement;
    dom.style.pointerEvents = "auto";
    dom.style.cursor = "grab";
    dom.addEventListener("pointerdown", (e) => {
      dom.style.cursor = "grabbing";
      onPointerDown(e);
    });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", () => {
      dom.style.cursor = "grab";
      onPointerUp();
    });

    let frameId;
    let t = 0;
    const startTime = performance.now();
    rig.scale.setScalar(0.001); // entrance: start tiny, scale in
    const animate = () => {
      t += 0.016;
      const elapsed = (performance.now() - startTime) / 1000;

      // entrance scale-in (smooth ease, ~0.9s)
      const entranceProgress = Math.min(elapsed / 0.9, 1);
      const eased = 1 - Math.pow(1 - entranceProgress, 3);
      rig.scale.setScalar(eased);

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;
      rig.rotation.y = rotY;
      rig.rotation.x = rotX;

      // gentle independent idle float for laptop & phone
      laptop.position.y = -1.6 + Math.sin(t * 0.7) * 0.12;
      phone.position.y = -1.2 + Math.sin(t * 0.9 + 1.4) * 0.15;
      phone.rotation.z = Math.sin(t * 0.5) * 0.02;

      // pulsing screen glow for a "live" feel
      const pulse = 1.1 + Math.sin(t * 1.8) * 0.35;
      rimLight.intensity = pulse;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (mount && renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [threeReady]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: 420,
        position: "relative",
        cursor: "grab",
      }}
    />
  );
}

/* =============================== 3D TILT HOOK (mouse-driven card tilt) =============================== */
function useTilt(maxTilt = 8) {
  const ref = useRef(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg) translateZ(0px)");

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(`rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(8px)`);
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    setTransform("rotateX(0deg) rotateY(0deg) translateZ(0px)");
  }, []);

  return { ref, transform, onMouseMove, onMouseLeave };
}

/* =============================== SCROLL REVEAL =============================== */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* =============================== 3D PAGE TRANSITION =============================== */
function PageTransition({ pageKey, children }) {
  const [show, setShow] = useState(false);
  const [renderKey, setRenderKey] = useState(pageKey);

  useEffect(() => {
    setShow(false);
    const t = setTimeout(() => {
      setRenderKey(pageKey);
      setShow(true);
    }, 90);
    return () => clearTimeout(t);
  }, [pageKey]);

  return (
    <div
      style={{
        perspective: 1200,
        minHeight: 320,
      }}
    >
      <div
        key={renderKey}
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "translateZ(0px) rotateX(0deg) scale(1)" : "translateZ(-40px) rotateX(4deg) scale(0.98)",
          transition: "opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =============================== STYLES =============================== */
const COLORS = {
  bg: "#0a0e0c",
  bgRaised: "#111613",
  bgCard: "#141a17",
  border: "#232b27",
  borderLight: "#33403a",
  text: "#eef2ee",
  textMuted: "#9aa69e",
  textFaint: "#5f6b64",
  accent: "#3ee08c",
  accentDim: "#1f7a4f",
  accentText: "#06150c",
};

const styles = {
  page: {
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100vh",
    width: "100%",
  },
  mono: { fontFamily: "'IBM Plex Mono', 'SF Mono', monospace" },
  shell: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(10,14,12,0.88)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${COLORS.border}`,
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLinks: { display: "flex", gap: 28, alignItems: "center" },
  navLink: (active) => ({
    fontSize: 14,
    cursor: "pointer",
    color: active ? COLORS.accent : COLORS.textMuted,
    fontWeight: active ? 500 : 400,
    transition: "color 0.15s",
    userSelect: "none",
  }),
  btnPrimary: {
    background: COLORS.accent,
    color: COLORS.accentText,
    border: "none",
    padding: "10px 18px",
    borderRadius: 3,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.15s ease, box-shadow 0.2s ease",
  },
  btnGhost: {
    background: "transparent",
    color: COLORS.text,
    border: `1px solid ${COLORS.borderLight}`,
    padding: "10px 18px",
    borderRadius: 3,
    fontSize: 14,
    fontWeight: 400,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.15s ease, border-color 0.2s ease",
  },
  input: {
    width: "100%",
    background: COLORS.bgRaised,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 3,
    color: COLORS.text,
    padding: "11px 13px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },
  label: { fontSize: 12.5, color: COLORS.textMuted, marginBottom: 6, display: "block", letterSpacing: 0.2 },
  card: {
    background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    padding: 24,
  },
  glassCard: {
    background: "rgba(20, 26, 23, 0.55)",
    border: "1px solid rgba(62, 224, 140, 0.16)",
    borderRadius: 10,
    padding: 24,
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
    transformStyle: "preserve-3d",
    willChange: "transform",
    transition: "transform 0.15s ease-out, border-color 0.25s, box-shadow 0.25s",
  },
  sectionLabel: {
    ...({ fontFamily: "'IBM Plex Mono', monospace" }),
    fontSize: 12.5,
    color: COLORS.accent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
};

function GlobalFonts() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
      />
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes rippleExpand {
          0% { width: 10px; height: 10px; margin-left: -5px; margin-top: -5px; opacity: 0.55; }
          100% { width: 220px; height: 220px; margin-left: -110px; margin-top: -110px; opacity: 0; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        * { scrollbar-color: #3ee08c #141a17; }
      `}</style>
    </>
  );
}

function useThreeLoader() {
  const [ready, setReady] = useState(!!window.THREE);
  useEffect(() => {
    if (window.THREE) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
    return () => {};
  }, []);
  return ready;
}

/* =============================== NAV =============================== */
function Nav({ page, setPage, company }) {
  const items = ["home", "services", "reviews", "about", "contact"];
  return (
    <div style={{ ...styles.nav, boxShadow: "0 1px 0 rgba(62,224,140,0.08)" }}>
      <div style={styles.navInner}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setPage("home")}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: COLORS.accent,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...styles.mono,
              fontWeight: 600,
              color: COLORS.accentText,
              fontSize: 14,
              boxShadow: "0 0 16px -2px rgba(62,224,140,0.7)",
            }}
          >
            {company.name.charAt(0)}
          </div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{company.name}</span>
        </div>
        <div style={styles.navLinks}>
          {items.map((it) => (
            <span key={it} style={{ ...styles.navLink(page === it), position: "relative", paddingBottom: 4 }} onClick={() => setPage(it)}>
              {it.charAt(0).toUpperCase() + it.slice(1)}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: 1.5,
                  width: page === it ? "100%" : "0%",
                  background: COLORS.accent,
                  boxShadow: "0 0 6px rgba(62,224,140,0.7)",
                  transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================== HERO / HOME =============================== */

function GlowOrb({ top, left, color, size = 360 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity: 0.35,
        filter: "blur(10px)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* =============================== CUSTOM CURSOR WITH SOFT TRAIL =============================== */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    let frameId;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%,-50%)`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid rgba(62,224,140,0.4)",
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: COLORS.accent,
          boxShadow: "0 0 8px rgba(62,224,140,0.9)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}

/* =============================== MAGNETIC BUTTON WRAPPER =============================== */
function Magnetic({ children, strength = 16 }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    setT({ x: x * strength, y: y * strength });
  };
  const onMouseLeave = () => setT({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        display: "inline-block",
        transform: `translate(${t.x}px, ${t.y}px)`,
        transition: "transform 0.18s cubic-bezier(0.2,0.8,0.2,1)",
      }}
    >
      {children}
    </div>
  );
}

/* =============================== CLICK RIPPLE EFFECT =============================== */
function useRipple() {
  const [ripples, setRipples] = useState([]);

  const trigger = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((rp) => rp.id !== id));
    }, 650);
  }, []);

  const RippleLayer = () => (
    <>
      {ripples.map((rp) => (
        <span
          key={rp.id}
          style={{
            position: "absolute",
            left: rp.x,
            top: rp.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            borderRadius: "50%",
            background: "rgba(62,224,140,0.5)",
            pointerEvents: "none",
            animation: "rippleExpand 0.65s ease-out forwards",
          }}
        />
      ))}
    </>
  );

  return { trigger, RippleLayer };
}

/* =============================== SCROLL PROGRESS BAR =============================== */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollPct = h.scrollHeight > h.clientHeight ? (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 : 0;
      setPct(scrollPct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, height: 2, width: "100%", zIndex: 100, background: "transparent" }}>
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: COLORS.accent,
          boxShadow: "0 0 8px rgba(62,224,140,0.7)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

/* =============================== ANIMATED COUNTER (counts up when revealed) =============================== */
function Counter({ to, suffix = "", duration = 1200 }) {
  const { ref, visible } = useReveal();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let startTime = null;
    let frameId;
    const step = (now) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [visible, to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function ServiceTeaserCard({ s }) {
  const tilt = useTilt(10);
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{
        ...styles.glassCard,
        padding: 20,
        transform: tilt.transform,
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.45)")}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.16)")}
    >
      <div style={{ color: COLORS.accent, marginBottom: 14, filter: "drop-shadow(0 0 6px rgba(62,224,140,0.5))" }}>
        <Icon name={s.icon} size={24} />
      </div>
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
      <div style={{ color: COLORS.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{s.summary}</div>
    </div>
  );
}

function Home({ setPage, company, services, reviews = [] }) {
  const ctaRipple = useRipple();
  const ghostRipple = useRipple();
  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <GlowOrb top={-80} left={-60} color="rgba(62,224,140,0.5)" />
        <GlowOrb top={60} left="70%" color="rgba(62,224,140,0.3)" size={280} />
        <div style={{ ...styles.shell, padding: "80px 24px 0", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
              <div style={styles.sectionLabel}>// service & software studio</div>
              <h1 style={{ fontSize: 44, lineHeight: 1.15, fontWeight: 600, margin: "0 0 20px" }}>
                {company.tagline}
              </h1>
              <p style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                {company.about}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <Magnetic>
                  <button
                    style={{ ...styles.btnPrimary, boxShadow: "0 0 24px -4px rgba(62,224,140,0.6)" }}
                    onClick={(e) => {
                      ctaRipple.trigger(e);
                      setTimeout(() => setPage("contact"), 120);
                    }}
                  >
                    <ctaRipple.RippleLayer />
                    Start a project <Icon name="arrow" size={15} />
                  </button>
                </Magnetic>
                <Magnetic strength={10}>
                  <button
                    style={styles.btnGhost}
                    onClick={(e) => {
                      ghostRipple.trigger(e);
                      setTimeout(() => setPage("services"), 120);
                    }}
                  >
                    <ghostRipple.RippleLayer />
                    View services
                  </button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <DeviceScene />
            <div
              style={{
                textAlign: "center",
                marginTop: -8,
                fontSize: 12.5,
                color: COLORS.textFaint,
                ...styles.mono,
              }}
            >
              <Icon name="arrow" size={11} /> drag to rotate
            </div>
          </div>
        </Reveal>
      </div>

      <div style={{ ...styles.shell, padding: "40px 24px 0", position: "relative" }}>
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              textAlign: "center",
            }}
          >
            {[
              { to: 40, suffix: "+", label: "Projects delivered" },
              { to: 98, suffix: "%", label: "Client satisfaction" },
              { to: 24, suffix: "h", label: "Avg. response time" },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: COLORS.accent,
                    ...styles.mono,
                    textShadow: "0 0 16px rgba(62,224,140,0.35)",
                  }}
                >
                  <Counter to={stat.to} suffix={stat.suffix} />
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, position: "relative", marginTop: 48 }}>
        <div style={{ ...styles.shell, padding: "56px 24px" }}>
          <Reveal>
            <div style={styles.sectionLabel}>what we build</div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 16 }}>
            {services.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.08}>
                <ServiceTeaserCard s={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div style={{ ...styles.shell, padding: "56px 24px 0", position: "relative" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
              <div style={styles.sectionLabel}>client reviews</div>
              <span
                style={{ color: COLORS.accent, fontSize: 13, cursor: "pointer", ...styles.mono }}
                onClick={() => setPage("reviews")}
              >
                view all →
              </span>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {reviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <ReviewCard r={r} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...styles.shell, padding: "64px 24px", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Have a project in mind?</h2>
          <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>
            Message us directly on WhatsApp — no forms, no waiting on email.
          </p>
          <Magnetic>
            <button
              style={{ ...styles.btnPrimary, background: "#25D366", color: "#06150c", boxShadow: "0 0 26px -4px rgba(37,211,102,0.6)" }}
              onClick={() =>
                openWhatsApp(company.whatsapp, `Hi ${company.name}, I'd like to ask about a project.`)
              }
            >
              <Icon name="whatsapp" size={16} /> Chat on WhatsApp
            </button>
          </Magnetic>
        </Reveal>
      </div>
    </div>
  );
}

/* =============================== SERVICES =============================== */
function ServiceCard({ s, company }) {
  const tilt = useTilt(7);
  const [flipped, setFlipped] = useState(false);
  const ripple = useRipple();

  const includes = {
    code: ["Requirements walkthrough", "Responsive build", "1 round of revisions", "Source code handover"],
    layout: ["Wireframes & mockups", "Design system basics", "Mobile + desktop views", "Editable source files"],
    "device-mobile": ["UI design + build", "Android/cross-platform", "Basic backend hookup", "Play Store guidance"],
    database: ["Schema design", "Data entry / migration", "Basic reporting view", "Staff training notes"],
    palette: ["Concept exploration", "2 revision rounds", "Print + web formats", "Source files included"],
  }[s.icon] || ["Initial consultation", "Drafts for review", "Revisions included", "Final files delivered"];

  return (
    <div style={{ perspective: 1200 }}>
      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: 280,
        }}
      >
        {/* FRONT */}
        <div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          style={{
            ...styles.glassCard,
            transform: `${tilt.transform} ${flipped ? "" : ""}`,
            backfaceVisibility: "hidden",
            position: flipped ? "absolute" : "relative",
            inset: 0,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.45)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.16)")}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ color: COLORS.accent, filter: "drop-shadow(0 0 6px rgba(62,224,140,0.5))" }}>
              <Icon name={s.icon} size={26} />
            </div>
            {s.price_label && (
              <span
                style={{
                  ...styles.mono,
                  fontSize: 12,
                  color: COLORS.accent,
                  border: "1px solid rgba(62,224,140,0.3)",
                  borderRadius: 3,
                  padding: "3px 8px",
                  background: "rgba(62,224,140,0.06)",
                }}
              >
                {s.price_label}
              </span>
            )}
          </div>
          <div style={{ fontWeight: 500, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
          <div style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>{s.summary}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{ ...styles.btnGhost, flex: 1, justifyContent: "center", fontSize: 13 }}
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
            >
              What's included
            </button>
            <button
              style={{ ...styles.btnGhost, width: 44, justifyContent: "center", padding: 0, position: "relative" }}
              onClick={(e) => {
                ripple.trigger(e);
                openWhatsApp(
                  company.whatsapp,
                  `Hi ${company.name}, I'm interested in your "${s.title}" service. Could you share more details and a quote?`
                );
              }}
            >
              <ripple.RippleLayer />
              <Icon name="whatsapp" size={15} />
            </button>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            ...styles.glassCard,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: flipped ? "relative" : "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4, color: COLORS.accent }}>{s.title}</div>
          <div style={{ ...styles.mono, fontSize: 11, color: COLORS.textFaint, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
            typically includes
          </div>
          <div style={{ display: "grid", gap: 9, marginBottom: 18, flex: 1 }}>
            {includes.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: COLORS.accent, marginTop: 1, flexShrink: 0 }}>
                  <Icon name="check" size={13} />
                </span>
                <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
          <button
            style={{ ...styles.btnGhost, width: "100%", justifyContent: "center", fontSize: 13 }}
            onClick={() => setFlipped(false)}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

/* =============================== REVIEWS =============================== */
function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            color: n <= rating ? COLORS.accent : COLORS.border,
            filter: n <= rating ? "drop-shadow(0 0 4px rgba(62,224,140,0.5))" : "none",
          }}
        >
          <Icon name="star" size={size} />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ r }) {
  const tilt = useTilt(6);
  const initials = r.name
    .split(" ")
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={{ ...styles.glassCard, transform: tilt.transform, display: "flex", flexDirection: "column" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.45)")}
      onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(62,224,140,0.16)")}
    >
      <div style={{ color: COLORS.accent, opacity: 0.5, marginBottom: 10 }}>
        <Icon name="quote" size={22} />
      </div>
      <StarRating rating={r.rating} />
      <p style={{ color: COLORS.text, fontSize: 14.5, lineHeight: 1.7, margin: "14px 0 20px", flex: 1 }}>
        {r.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 16, borderTop: "1px solid rgba(62,224,140,0.1)" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(62,224,140,0.12)",
            border: "1px solid rgba(62,224,140,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...styles.mono,
            fontSize: 13,
            fontWeight: 500,
            color: COLORS.accent,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 13.5 }}>{r.name}</div>
          <div style={{ color: COLORS.textFaint, fontSize: 12 }}>{r.role}</div>
        </div>
      </div>
      {r.service && (
        <div
          style={{
            ...styles.mono,
            fontSize: 11,
            color: COLORS.textFaint,
            marginTop: 12,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            padding: "3px 8px",
            display: "inline-block",
            alignSelf: "flex-start",
          }}
        >
          {r.service}
        </div>
      )}
    </div>
  );
}

function Reviews({ reviews, company }) {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";
  return (
    <div style={{ ...styles.shell, padding: "64px 24px 96px", position: "relative" }}>
      <GlowOrb top={-40} left="55%" color="rgba(62,224,140,0.25)" size={320} />
      <Reveal>
        <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
          <div style={styles.sectionLabel}>reviews</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px" }}>What clients say</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 600, ...styles.mono, color: COLORS.accent }}>{avg}</span>
              <StarRating rating={Math.round(Number(avg))} size={16} />
            </div>
            <span style={{ color: COLORS.textMuted, fontSize: 13.5 }}>
              based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, position: "relative", zIndex: 1 }}>
        {reviews.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i * 0.07, 0.35)}>
            <ReviewCard r={r} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: COLORS.textMuted, marginBottom: 18, fontSize: 14 }}>Worked with us? We'd love to hear about it.</p>
          <Magnetic>
            <button
              style={{ ...styles.btnPrimary, background: "#25D366", color: "#06150c", boxShadow: "0 0 24px -4px rgba(37,211,102,0.6)" }}
              onClick={() =>
                openWhatsApp(company.whatsapp, `Hi ${company.name}, I'd like to share feedback about a project.`)
              }
            >
              <Icon name="whatsapp" size={16} /> Share your feedback
            </button>
          </Magnetic>
        </div>
      </Reveal>
    </div>
  );
}

function Services({ services, company }) {
  return (
    <div style={{ ...styles.shell, padding: "64px 24px 96px", position: "relative" }}>
      <Reveal>
        <div style={styles.sectionLabel}>services</div>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 12px" }}>What we offer</h1>
        <p style={{ color: COLORS.textMuted, marginBottom: 40, maxWidth: 560 }}>
          Pick a service below and send us the details on WhatsApp — we'll reply with a quote, usually within a day.
        </p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {services.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i * 0.06, 0.3)}>
            <ServiceCard s={s} company={company} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* =============================== ABOUT =============================== */
function About({ company }) {
  const points = [
    "Direct communication — talk to the people actually building your project.",
    "Fixed-scope quotes before any work starts, no surprise costs.",
    "Built with modern, maintainable tech: React, PHP/Laravel, Supabase.",
  ];
  return (
    <div style={{ ...styles.shell, padding: "64px 24px 96px", position: "relative" }}>
      <GlowOrb top={-40} left="60%" color="rgba(62,224,140,0.25)" size={300} />
      <Reveal>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={styles.sectionLabel}>about</div>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 20px" }}>{company.name}</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 16, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
            {company.about}
          </p>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            {points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: COLORS.accent, marginTop: 2, filter: "drop-shadow(0 0 5px rgba(62,224,140,0.5))" }}>
                  <Icon name="check" size={16} />
                </span>
                <span style={{ color: COLORS.text, fontSize: 14.5, lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 44, ...styles.glassCard, maxWidth: 460 }}>
            <div style={{ ...styles.mono, fontSize: 12, color: COLORS.textFaint, marginBottom: 14 }}>contact details</div>
            <div style={{ display: "grid", gap: 10, fontSize: 14 }}>
              <div style={{ color: COLORS.textMuted }}>Email <span style={{ color: COLORS.text, float: "right" }}>{company.email}</span></div>
              <div style={{ color: COLORS.textMuted }}>Location <span style={{ color: COLORS.text, float: "right" }}>{company.location}</span></div>
              <div style={{ color: COLORS.textMuted }}>WhatsApp <span style={{ color: COLORS.text, float: "right" }}>+{company.whatsapp}</span></div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* =============================== CONTACT =============================== */
function Contact({ company, services }) {
  const [form, setForm] = useState({ name: "", service: services[0]?.title || "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    const text = `Hi ${company.name}, my name is ${form.name || "—"}.\nService: ${form.service}\nDetails: ${form.message || "—"}`;
    openWhatsApp(company.whatsapp, text);
  };

  return (
    <div style={{ ...styles.shell, padding: "64px 24px 96px", position: "relative" }}>
      <GlowOrb top={20} left={-40} color="rgba(62,224,140,0.25)" size={320} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, position: "relative", zIndex: 1 }}>
        <Reveal>
          <div>
            <div style={styles.sectionLabel}>contact</div>
            <h1 style={{ fontSize: 32, fontWeight: 600, margin: "0 0 16px" }}>Tell us about your project</h1>
            <p style={{ color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
              Fill this in and it opens WhatsApp with your message ready to send — nothing is stored, you're chatting
              directly with us.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.textMuted, fontSize: 14 }}>
              <Icon name="whatsapp" size={18} />
              <span>+{company.whatsapp}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <form onSubmit={submit} style={{ ...styles.glassCard }}>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Your name</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Kasun Perera"
                required
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.label}>Service</label>
              <select
                style={{ ...styles.input, appearance: "auto" }}
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="Other">Other / not sure</option>
              </select>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={styles.label}>Project details</label>
              <textarea
                style={{ ...styles.input, minHeight: 100, resize: "vertical", fontFamily: "inherit" }}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="A short description of what you need..."
              />
            </div>
            <button
              type="submit"
              style={{
                ...styles.btnPrimary,
                width: "100%",
                justifyContent: "center",
                background: "#25D366",
                color: "#06150c",
                boxShadow: "0 0 24px -4px rgba(37,211,102,0.6)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >
              <Icon name="whatsapp" size={16} /> Send via WhatsApp
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}

/* =============================== ADMIN =============================== */
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || "Login failed");
      onLogin({ email, token: data.access_token });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tilt = useTilt(5);

  return (
    <div style={{ ...styles.shell, padding: "96px 24px", display: "flex", justifyContent: "center", position: "relative" }}>
      <GlowOrb top={-20} left="50%" color="rgba(62,224,140,0.3)" size={320} />
      <form
        onSubmit={submit}
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={{ ...styles.glassCard, width: 360, transform: tilt.transform, position: "relative", zIndex: 1 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ color: COLORS.accent, filter: "drop-shadow(0 0 6px rgba(62,224,140,0.5))" }}>
            <Icon name="lock" size={18} />
          </span>
          <span style={{ fontWeight: 500, fontSize: 16 }}>Admin login</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="admin@yourcompany.lk" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
        </div>
        {error && <div style={{ color: "#f08080", fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <button
          type="submit"
          style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", boxShadow: "0 0 22px -4px rgba(62,224,140,0.6)" }}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function AdminPanel({ admin, onLogout, services, setServices, company, setCompany, reviews, setReviews }) {
  const [tab, setTab] = useState("services");
  const [draft, setDraft] = useState(null);
  const [reviewDraft, setReviewDraft] = useState(null);
  const [companyDraft, setCompanyDraft] = useState(company);
  const [savedMsg, setSavedMsg] = useState("");

  const flashSaved = () => {
    setSavedMsg("Saved");
    setTimeout(() => setSavedMsg(""), 1500);
  };

  const saveService = async () => {
    const isNew = !services.find((s) => s.id === draft.id);
    let updated;
    try {
      if (isNew) {
        const row = await api("services", { method: "POST", body: { ...draft, id: undefined }, token: admin.token });
        updated = [...services, row];
      } else {
        const row = await api(`services/${draft.id}`, { method: "PUT", body: draft, token: admin.token });
        updated = services.map((s) => (s.id === draft.id ? row : s));
      }
    } catch (err) {
      alert("Error saving: " + err.message);
      return;
    }
    setServices(updated);
    setDraft(null);
    flashSaved();
  };

  const deleteService = async (id) => {
    try {
      await api(`services/${id}`, { method: "DELETE", token: admin.token });
    } catch {}
    setServices(services.filter((s) => s.id !== id));
  };

  const saveReview = async () => {
    const isNew = !reviews.find((r) => r.id === reviewDraft.id);
    let updated;
    try {
      if (isNew) {
        const row = await api("reviews", { method: "POST", body: { ...reviewDraft, id: undefined }, token: admin.token });
        updated = [...reviews, row];
      } else {
        const row = await api(`reviews/${reviewDraft.id}`, { method: "PUT", body: reviewDraft, token: admin.token });
        updated = reviews.map((r) => (r.id === reviewDraft.id ? row : r));
      }
    } catch (err) {
      alert("Error saving: " + err.message);
      return;
    }
    setReviews(updated);
    setReviewDraft(null);
    flashSaved();
  };

  const deleteReview = async (id) => {
    try {
      await api(`reviews/${id}`, { method: "DELETE", token: admin.token });
    } catch {}
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const saveCompany = async () => {
    try {
      await api("company", { method: "PUT", body: companyDraft, token: admin.token });
      setCompany(companyDraft);
      flashSaved();
    } catch (err) {
      alert("Error saving: " + err.message);
    }
  };

  return (
    <div style={{ ...styles.shell, padding: "40px 24px 96px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={styles.sectionLabel}>admin panel</div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Manage {company.name}</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {savedMsg && <span style={{ color: COLORS.accent, fontSize: 13 }}>{savedMsg}</span>}
          <span style={{ color: COLORS.textFaint, fontSize: 13 }}>{admin.email}</span>
          <button style={styles.btnGhost} onClick={onLogout}>
            <Icon name="logout" size={15} /> Log out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${COLORS.border}` }}>
        {["services", "reviews", "company"].map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "10px 4px",
              marginRight: 24,
              cursor: "pointer",
              fontSize: 14,
              color: tab === t ? COLORS.text : COLORS.textMuted,
              borderBottom: tab === t ? `2px solid ${COLORS.accent}` : "2px solid transparent",
            }}
          >
            {t === "services" ? "Services" : t === "reviews" ? "Reviews" : "Company info"}
          </div>
        ))}
      </div>

      {tab === "services" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              style={styles.btnPrimary}
              onClick={() =>
                setDraft({ id: `s${Date.now()}`, title: "", summary: "", price_label: "", icon: "code" })
              }
            >
              <Icon name="plus" size={15} /> Add service
            </button>
          </div>

          {draft && (
            <div style={{ ...styles.glassCard, marginBottom: 20 }}>
              <div style={{ fontWeight: 500, marginBottom: 16 }}>
                {services.find((s) => s.id === draft.id) ? "Edit service" : "New service"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={styles.label}>Title</label>
                  <input style={styles.input} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Price label</label>
                  <input style={styles.input} value={draft.price_label} onChange={(e) => setDraft({ ...draft, price_label: e.target.value })} placeholder="From LKR 20,000" />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={styles.label}>Summary</label>
                <textarea
                  style={{ ...styles.input, minHeight: 70, fontFamily: "inherit" }}
                  value={draft.summary}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={styles.label}>Icon</label>
                <select style={{ ...styles.input, appearance: "auto" }} value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                  <option value="code">Code</option>
                  <option value="layout">Layout</option>
                  <option value="device-mobile">Mobile</option>
                  <option value="database">Database</option>
                  <option value="palette">Design / palette</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={styles.btnPrimary} onClick={saveService}>Save</button>
                <button style={styles.btnGhost} onClick={() => setDraft(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 10 }}>
            {services.map((s) => (
              <div key={s.id} style={{ ...styles.glassCard, display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ color: COLORS.accent }}><Icon name={s.icon} size={20} /></span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14.5 }}>{s.title}</div>
                    <div style={{ color: COLORS.textFaint, fontSize: 12.5 }}>{s.price_label}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.btnGhost} onClick={() => setDraft(s)}><Icon name="layout" size={14} /></button>
                  <button style={{ ...styles.btnGhost, color: "#f08080" }} onClick={() => deleteService(s.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              style={styles.btnPrimary}
              onClick={() =>
                setReviewDraft({ id: `r${Date.now()}`, name: "", role: "", service: "", rating: 5, text: "" })
              }
            >
              <Icon name="plus" size={15} /> Add review
            </button>
          </div>

          {reviewDraft && (
            <div style={{ ...styles.glassCard, marginBottom: 20 }}>
              <div style={{ fontWeight: 500, marginBottom: 16 }}>
                {reviews.find((r) => r.id === reviewDraft.id) ? "Edit review" : "New review"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={styles.label}>Customer name</label>
                  <input style={styles.input} value={reviewDraft.name} onChange={(e) => setReviewDraft({ ...reviewDraft, name: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Role / business</label>
                  <input style={styles.input} value={reviewDraft.role} onChange={(e) => setReviewDraft({ ...reviewDraft, role: e.target.value })} placeholder="Owner, ABC Traders" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={styles.label}>Service</label>
                  <input style={styles.input} value={reviewDraft.service} onChange={(e) => setReviewDraft({ ...reviewDraft, service: e.target.value })} placeholder="Web development" />
                </div>
                <div>
                  <label style={styles.label}>Rating (1-5)</label>
                  <select
                    style={{ ...styles.input, appearance: "auto" }}
                    value={reviewDraft.rating}
                    onChange={(e) => setReviewDraft({ ...reviewDraft, rating: Number(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={styles.label}>Review text</label>
                <textarea
                  style={{ ...styles.input, minHeight: 80, fontFamily: "inherit" }}
                  value={reviewDraft.text}
                  onChange={(e) => setReviewDraft({ ...reviewDraft, text: e.target.value })}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={styles.btnPrimary} onClick={saveReview}>Save</button>
                <button style={styles.btnGhost} onClick={() => setReviewDraft(null)}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 10 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ ...styles.glassCard, display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <StarRating rating={r.rating} size={12} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14.5 }}>{r.name}</div>
                    <div style={{ color: COLORS.textFaint, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>
                      {r.text}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={styles.btnGhost} onClick={() => setReviewDraft(r)}><Icon name="layout" size={14} /></button>
                  <button style={{ ...styles.btnGhost, color: "#f08080" }} onClick={() => deleteReview(r.id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div style={{ color: COLORS.textFaint, fontSize: 13.5, textAlign: "center", padding: 30 }}>
                No reviews yet. Add your first one above.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "company" && (
        <div style={{ ...styles.glassCard, maxWidth: 540 }}>
          {[
            ["name", "Company name"],
            ["tagline", "Tagline"],
            ["email", "Email"],
            ["location", "Location"],
            ["whatsapp", "WhatsApp number (no + or spaces)"],
          ].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={styles.label}>{label}</label>
              <input
                style={styles.input}
                value={companyDraft[key]}
                onChange={(e) => setCompanyDraft({ ...companyDraft, [key]: e.target.value })}
              />
            </div>
          ))}
          <div style={{ marginBottom: 18 }}>
            <label style={styles.label}>About</label>
            <textarea
              style={{ ...styles.input, minHeight: 90, fontFamily: "inherit" }}
              value={companyDraft.about}
              onChange={(e) => setCompanyDraft({ ...companyDraft, about: e.target.value })}
            />
          </div>
          <button style={styles.btnPrimary} onClick={saveCompany}>Save changes</button>
        </div>
      )}
    </div>
  );
}

/* =============================== FOOTER =============================== */
function Footer({ company }) {
  return (
    <div style={{ borderTop: "1px solid rgba(62,224,140,0.1)", padding: "32px 24px" }}>
      <div style={{ ...styles.shell, padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{ color: COLORS.textFaint, fontSize: 13 }}>© {new Date().getFullYear()} {company.name}</span>
      </div>
    </div>
  );
}

/* =============================== APP ROOT =============================== */
function getInitialPage() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") return "admin";
  } catch {
    /* window/location not available in this environment */
  }
  return "home";
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [admin, setAdmin] = useState(null);
  const [services, setServices] = useState(DEMO_SERVICES);
  const [company, setCompany] = useState(DEMO_COMPANY);
  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [svc, comp, rev] = await Promise.all([
          api("services"),
          api("company"),
          api("reviews").catch(() => null),
        ]);
        if (svc?.length) setServices(svc);
        if (comp?.length) setCompany(comp[0]);
        if (rev?.length) setReviews(rev);
      } catch {
        /* fall back to demo data silently */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return null;

  return (
    <div style={{ ...styles.page, position: "relative" }}>
      <GlobalFonts />
      <CustomCursor />
      <ScrollProgress />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav page={page} setPage={setPage} company={company} />

        <PageTransition pageKey={page}>
          {page === "home" && <Home setPage={setPage} company={company} services={services} reviews={reviews} />}
          {page === "services" && <Services services={services} company={company} />}
          {page === "reviews" && <Reviews reviews={reviews} company={company} />}
          {page === "about" && <About company={company} />}
          {page === "contact" && <Contact company={company} services={services} />}
          {page === "admin" &&
            (admin ? (
              <AdminPanel
                admin={admin}
                onLogout={() => setAdmin(null)}
                services={services}
                setServices={setServices}
                company={company}
                setCompany={setCompany}
                reviews={reviews}
                setReviews={setReviews}
              />
            ) : (
              <AdminLogin onLogin={setAdmin} />
            ))}
        </PageTransition>

        <Footer company={company} />
      </div>
    </div>
  );
}
