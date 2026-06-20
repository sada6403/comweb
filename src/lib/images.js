/* Bundled, license-safe photography (Unsplash) served from /public/images.
   Centralised here so components don't hardcode paths. */

export const HERO_IMG = "/images/hero.jpg";
export const CONTACT_IMG = "/images/contact.jpg";
export const ABOUT_IMAGES = [
  "/images/about-1.jpg",
  "/images/about-2.jpg",
  "/images/about-3.jpg",
];

export const AVATARS = [
  "/images/avatar-1.jpg",
  "/images/avatar-2.jpg",
  "/images/avatar-3.jpg",
  "/images/avatar-4.jpg",
];

/* Curated photo per service category, keyed by the service's icon. */
const SERVICE_IMAGES = {
  code: "/images/svc-code.jpg",
  layout: "/images/svc-layout.jpg",
  "device-mobile": "/images/svc-mobile.jpg",
  database: "/images/svc-database.jpg",
  palette: "/images/svc-palette.jpg",
};

export function serviceImage(icon) {
  return SERVICE_IMAGES[icon] || SERVICE_IMAGES.code;
}

/* Deterministic avatar pick so a given review always shows the same face. */
export function avatarFor(id = "") {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return AVATARS[sum % AVATARS.length];
}
