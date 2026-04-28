const { useEffect, useState } = React;

const SITE_NAME = "Dobbaballapur Rents";
const STORAGE_KEY = "dobbaballapur-rents-listings-v1";
const ADMIN_PASSWORD = "admin123";
const PROPERTY_TYPES = ["House", "Apartment", "PG", "Room"];
const AVAILABILITY_OPTIONS = ["Available", "Already Rented"];

const APP_STYLES = `
:root {
  --cream:#fffaf2; --cream-deep:#f5ead7; --sand:#e8d5ba; --saffron:#d2732b; --saffron-deep:#af5617;
  --green:#23513a; --green-deep:#17382a; --leaf:#3f7653; --text:#2e2418; --muted:#67594a;
  --line:rgba(46,36,24,0.12); --surface:rgba(255,250,242,0.9); --success:#2e7a4d; --danger:#b64531;
  --shadow:0 24px 64px rgba(91,60,24,0.14); --radius-xl:34px; --radius-lg:24px; --radius-md:18px; --radius-sm:14px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0; min-width:320px; font-family:"Lato","Segoe UI",sans-serif; color:var(--text);
  background:
    radial-gradient(circle at top left, rgba(210,115,43,0.2), transparent 28%),
    radial-gradient(circle at 85% 8%, rgba(63,118,83,0.18), transparent 24%),
    linear-gradient(180deg, #fffaf3 0%, #f7efdf 46%, #fcf8f2 100%);
}
a{color:inherit; text-decoration:none}
button,input,select,textarea{font:inherit}
img{display:block; max-width:100%}
.container{width:min(1200px, calc(100% - 32px)); margin:0 auto}
.sticky-bar{position:sticky; top:0; z-index:20; background:rgba(255,250,242,0.78); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.7)}
.navbar{display:flex; align-items:center; justify-content:space-between; gap:18px; padding:16px 0}
.brand{display:inline-flex; align-items:center; gap:12px}
.brand-mark{display:grid; place-items:center; width:48px; height:48px; border-radius:16px; background:linear-gradient(135deg, var(--saffron), #efb25d); color:#fff; font-weight:900; box-shadow:0 16px 24px rgba(210,115,43,0.22)}
.brand-copy{display:grid; gap:4px}
.brand-title,.hero-title,.section-title,.modal-title,.panel-title,.stat-number{font-family:"Noto Serif Kannada", Georgia, serif}
.brand-title{font-size:1.1rem; font-weight:700}
.brand-subtitle,.muted-text,.admin-helper,.section-subtitle,.hero-tagline,.empty-state p,.info-panel p,.hero-feature-card p,.modal-copy{color:var(--muted); line-height:1.7}
.brand-subtitle{font-size:0.92rem}
.nav-links{display:flex; align-items:center; gap:16px; flex-wrap:wrap}
.nav-link{color:var(--muted); font-weight:700}
.nav-link:hover,.nav-link:focus-visible{color:var(--green)}
.button,.button-link{
  display:inline-flex; align-items:center; justify-content:center; gap:8px; border:none; cursor:pointer;
  border-radius:999px; padding:13px 18px; font-weight:900; transition:transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.button:hover,.button-link:hover,.button:focus-visible,.button-link:focus-visible{transform:translateY(-2px)}
.button-primary{background:linear-gradient(135deg, var(--saffron), #eea24c); color:#fff; box-shadow:0 16px 28px rgba(210,115,43,0.22)}
.button-secondary{background:rgba(35,81,58,0.1); color:var(--green); border:1px solid rgba(35,81,58,0.12)}
.button-ghost{background:rgba(255,255,255,0.66); color:var(--text); border:1px solid rgba(46,36,24,0.12)}
.button-danger{background:rgba(182,69,49,0.12); color:var(--danger); border:1px solid rgba(182,69,49,0.14)}
.hero{padding:48px 0 26px}
.hero-grid,.login-layout,.modal-layout{display:grid; grid-template-columns:1.1fr 0.9fr; gap:28px}
.hero-copy,.hero-panel,.filter-panel,.info-panel,.property-card,.admin-card,.login-card,.dashboard-summary,.footer-card,.empty-state,.modal-card{
  background:var(--surface); border:1px solid rgba(255,255,255,0.78); box-shadow:var(--shadow); backdrop-filter:blur(18px)
}
.hero-copy{padding:42px; border-radius:var(--radius-xl); position:relative; overflow:hidden}
.hero-copy::after{content:""; position:absolute; inset:auto -80px -90px auto; width:240px; height:240px; border-radius:50%; background:radial-gradient(circle, rgba(63,118,83,0.28), transparent 66%)}
.eyebrow{margin:0 0 14px; letter-spacing:0.08em; text-transform:uppercase; color:var(--saffron-deep); font-size:0.82rem; font-weight:900}
.hero-title{margin:0; font-size:clamp(2.8rem, 7vw, 4.9rem); line-height:0.98}
.hero-tagline{margin:18px 0 0; font-size:1.12rem; max-width:55ch}
.hero-actions,.filter-actions,.admin-form-actions,.modal-actions,.login-actions,.table-actions{display:flex; gap:10px; flex-wrap:wrap}
.hero-actions{margin-top:28px}
.hero-pills{display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:14px; margin-top:28px}
.hero-pill{padding:18px; border-radius:18px; background:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.78)}
.hero-pill strong{display:block; font-size:1.2rem; color:var(--green)}
.hero-pill span{color:var(--muted); font-size:0.95rem}
.hero-panel{border-radius:var(--radius-xl); padding:30px; display:grid; gap:18px; position:relative; overflow:hidden; background:radial-gradient(circle at top right, rgba(210,115,43,0.18), transparent 28%), linear-gradient(180deg, rgba(255,252,246,0.95), rgba(244,233,214,0.86))}
.hero-panel::before{content:""; position:absolute; inset:18px; border-radius:calc(var(--radius-xl) - 12px); border:1px dashed rgba(35,81,58,0.16)}
.hero-feature-card{position:relative; z-index:1; border-radius:var(--radius-lg); padding:24px; background:rgba(255,255,255,0.74); border:1px solid rgba(255,255,255,0.86)}
.feature-chip{display:inline-flex; padding:8px 12px; border-radius:999px; background:rgba(35,81,58,0.12); color:var(--green); font-size:0.85rem; font-weight:900}
.hero-feature-card h2{margin:16px 0 8px; font-size:1.9rem; line-height:1.2}
.feature-metrics{display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:14px}
.feature-metric{border-radius:18px; padding:18px; background:rgba(23,56,42,0.92); color:#fff}
.feature-metric strong{display:block; font-size:1.5rem}
.hero-areas{display:flex; gap:10px; flex-wrap:wrap}
.hero-area-chip{padding:10px 14px; border-radius:999px; border:1px solid rgba(35,81,58,0.12); background:rgba(255,255,255,0.7); color:var(--green-deep); font-weight:700}
.section,.footer,.admin-page{padding:30px 0 0}
.footer{padding-bottom:34px}
.section-heading,.admin-header,.footer-card,.modal-header{display:flex; justify-content:space-between; gap:16px}
.section-heading{align-items:end; margin-bottom:18px}
.admin-header{align-items:center; margin-bottom:22px; flex-wrap:wrap}
.modal-header{align-items:start; margin-bottom:18px}
.section-title{margin:0; font-size:clamp(2rem, 5vw, 3.2rem); line-height:1.04}
.section-subtitle{margin:10px 0 0; max-width:56ch}
.results-note,.summary-label,.small-note,.property-location,.advance-note,.table-subline{color:var(--muted); font-weight:700}
.filter-panel{border-radius:var(--radius-xl); padding:24px; margin-top:20px}
.filter-grid,.admin-form-grid,.summary-grid,.info-grid,.modal-meta-grid,.property-meta,.photo-grid,.thumbnail-row{display:grid; gap:14px}
.filter-grid{grid-template-columns:1.5fr repeat(5, minmax(0,1fr))}
.admin-form-grid{grid-template-columns:repeat(2, minmax(0,1fr))}
.summary-grid{grid-template-columns:repeat(4, minmax(0,1fr))}
.info-grid,.property-grid{grid-template-columns:repeat(3, minmax(0,1fr))}
.property-grid{display:grid; gap:20px; margin-top:22px}
.field{display:grid; gap:8px}
.field label,.field span,.field-title{font-size:0.92rem; font-weight:900}
.input,.select,.textarea{
  width:100%; border:1px solid rgba(46,36,24,0.14); border-radius:14px; background:rgba(255,255,255,0.9);
  color:var(--text); padding:13px 14px; outline:none; transition:border-color 180ms ease, box-shadow 180ms ease
}
.input:focus,.select:focus,.textarea:focus{border-color:rgba(210,115,43,0.7); box-shadow:0 0 0 3px rgba(210,115,43,0.12)}
.textarea{min-height:118px; resize:vertical}
.property-card{border-radius:26px; overflow:hidden; transition:transform 220ms ease, box-shadow 220ms ease}
.property-card:hover{transform:translateY(-5px); box-shadow:0 30px 70px rgba(91,60,24,0.18)}
.property-card.is-rented{opacity:0.86}
.property-image-wrap{position:relative; aspect-ratio:16/11; overflow:hidden}
.property-image{width:100%; height:100%; object-fit:cover; transition:transform 240ms ease}
.property-card:hover .property-image{transform:scale(1.04)}
.image-badges{position:absolute; top:14px; left:14px; right:14px; display:flex; justify-content:space-between; gap:12px}
.badge{display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; border-radius:999px; font-size:0.8rem; font-weight:900; backdrop-filter:blur(8px)}
.badge-type{background:rgba(255,250,242,0.9); color:var(--green-deep)}
.badge-available{background:rgba(46,122,77,0.88); color:#fff}
.badge-rented{background:rgba(182,69,49,0.88); color:#fff}
.property-body{padding:22px; display:grid; gap:14px}
.property-title-row,.card-footer{display:flex; justify-content:space-between; gap:12px}
.property-title-row{align-items:start}
.card-footer{align-items:center}
.property-title{margin:0; font-size:1.34rem; line-height:1.3}
.price-block{display:grid; gap:4px; justify-items:end}
.rent-highlight{color:var(--success); font-size:1.35rem; font-weight:900}
.meta-card,.modal-meta-card,.summary-item{
  border-radius:16px; padding:14px; background:rgba(35,81,58,0.07); color:var(--green-deep); font-weight:700
}
.empty-state,.admin-card,.login-card,.dashboard-summary,.modal-card{border-radius:26px; padding:26px}
.empty-state{text-align:center; margin-top:18px}
.info-panel{border-radius:26px; padding:24px}
.info-panel h3{margin:14px 0 10px; font-size:1.34rem}
.info-icon{display:inline-grid; place-items:center; width:46px; height:46px; border-radius:16px; background:rgba(210,115,43,0.12); color:var(--saffron-deep); font-weight:900}
.footer-card{align-items:center; padding:22px; border-radius:26px}
.footer-copy strong{display:block; font-size:1.04rem}
.summary-item{background:rgba(255,255,255,0.72); border:1px solid rgba(255,255,255,0.78)}
.stat-number{display:block; margin-top:8px; font-size:1.7rem; line-height:1.1}
.panel-title{margin:0 0 10px; font-size:1.9rem}
.field-wide{grid-column:1/-1}
.photo-grid{grid-template-columns:repeat(3, minmax(0,1fr))}
.table-wrap{overflow-x:auto; border-radius:20px; border:1px solid rgba(46,36,24,0.08); background:rgba(255,255,255,0.56)}
table{width:100%; border-collapse:collapse; min-width:860px}
th,td{padding:16px 14px; border-bottom:1px solid rgba(46,36,24,0.08); text-align:left; vertical-align:top}
th{color:var(--green-deep); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.04em}
.table-title{font-weight:900}
.table-subline{display:block; margin-top:4px; font-size:0.92rem}
.login-layout{align-items:stretch}
.login-highlight{
  border-radius:28px; padding:28px; background:linear-gradient(145deg, rgba(35,81,58,0.96), rgba(63,118,83,0.9));
  color:#fff; box-shadow:var(--shadow)
}
.login-highlight .eyebrow{color:rgba(255,255,255,0.78)}
.login-highlight p{color:rgba(255,255,255,0.84); line-height:1.8}
.login-list{display:grid; gap:12px; margin-top:20px}
.login-list-item{display:flex; align-items:start; gap:10px}
.login-dot{width:10px; height:10px; border-radius:50%; margin-top:8px; background:rgba(255,255,255,0.78)}
.error-note{color:var(--danger); font-weight:700}
.modal-backdrop{position:fixed; inset:0; z-index:40; display:grid; place-items:center; padding:18px; background:rgba(15,25,20,0.58); backdrop-filter:blur(8px)}
.modal-card{width:min(980px, 100%); max-height:calc(100vh - 36px); overflow:auto; border-radius:30px}
.modal-title{margin:0; font-size:clamp(1.8rem, 4vw, 2.6rem); line-height:1.12}
.modal-hero-image{width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:24px}
.thumbnail-row{grid-template-columns:repeat(3, minmax(0,1fr)); margin-top:12px; gap:10px}
.thumbnail-button{border:none; padding:0; background:transparent; cursor:pointer}
.thumbnail-image{width:100%; aspect-ratio:1.2; object-fit:cover; border-radius:16px; border:2px solid transparent}
.thumbnail-image.is-active{border-color:var(--saffron)}
.modal-meta-grid{grid-template-columns:repeat(2, minmax(0,1fr)); margin:18px 0}
.modal-meta-card strong{display:block; color:var(--green); margin-bottom:4px}
.modal-contact{border-radius:20px; padding:18px; background:rgba(210,115,43,0.08); border:1px solid rgba(210,115,43,0.12); margin-top:18px}
.modal-contact strong{display:block; margin-bottom:8px; color:var(--saffron-deep)}
.modal-close{min-width:42px; min-height:42px; border-radius:50%; border:1px solid rgba(46,36,24,0.1); background:rgba(255,255,255,0.76); cursor:pointer; font-size:1.25rem}
.status-inline{display:inline-flex; align-items:center; gap:8px; color:var(--muted); font-weight:700}
.status-dot{width:10px; height:10px; border-radius:50%}
.status-dot.available{background:var(--success)}
.status-dot.rented{background:var(--danger)}
.anchor-section{scroll-margin-top:92px}
@media (max-width:1080px){
  .hero-grid,.login-layout,.modal-layout{grid-template-columns:1fr}
  .filter-grid{grid-template-columns:repeat(3, minmax(0,1fr))}
  .property-grid,.info-grid,.summary-grid{grid-template-columns:repeat(2, minmax(0,1fr))}
}
@media (max-width:760px){
  .container{width:min(100% - 20px, 100%)}
  .navbar,.section-heading,.footer-card,.admin-header,.property-title-row,.card-footer{flex-direction:column; align-items:start}
  .hero-copy,.hero-panel,.filter-panel,.admin-card,.login-card,.dashboard-summary,.modal-card{padding:20px}
  .hero-pills,.property-grid,.info-grid,.summary-grid,.filter-grid,.admin-form-grid,.photo-grid,.modal-meta-grid,.property-meta{grid-template-columns:1fr}
  .price-block{justify-items:start}
  .hero-title{font-size:clamp(2.4rem, 12vw, 3.4rem)}
}
`;

function createId() {
  return `listing-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyFormState() {
  return {
    title: "",
    type: "House",
    monthlyRent: "",
    advanceAmount: "",
    bedrooms: "1",
    bathrooms: "1",
    location: "",
    mapLink: "",
    contactName: "",
    contactPhone: "",
    availability: "Available",
    description: "",
    photos: ["", "", ""],
  };
}

function defaultFilters() {
  return {
    search: "",
    type: "All",
    minRent: "",
    maxRent: "",
    bedrooms: "Any",
    availability: "Available",
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatAverageRent(listings) {
  if (!listings.length) {
    return formatCurrency(0);
  }

  const total = listings.reduce((sum, listing) => sum + Number(listing.monthlyRent || 0), 0);
  return formatCurrency(Math.round(total / listings.length));
}

function sanitizePhoneNumber(phoneNumber) {
  return String(phoneNumber || "").replace(/[^\d+]/g, "");
}

function ensurePhotoSlots(photos = []) {
  return Array.from({ length: 3 }, (_, index) => photos[index] || "");
}

function createPlaceholderImage(title, location, type) {
  const palette = {
    House: { top: "#d47b34", bottom: "#f4d6a6", accent: "#224f39" },
    Apartment: { top: "#3b6f58", bottom: "#d7ebdc", accent: "#d2732b" },
    PG: { top: "#c9602b", bottom: "#fde8c6", accent: "#35684d" },
    Room: { top: "#7a5636", bottom: "#f2dfca", accent: "#2d6145" },
  };
  const theme = palette[type] || palette.House;
  const safeTitle = String(title || "Rental Home").slice(0, 38);
  const safeLocation = String(location || "Dobbaballapur").slice(0, 34);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 840">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.top}" />
          <stop offset="100%" stop-color="${theme.bottom}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="840" fill="url(#bg)" />
      <circle cx="1020" cy="150" r="120" fill="rgba(255,255,255,0.18)" />
      <circle cx="170" cy="690" r="160" fill="rgba(255,255,255,0.14)" />
      <path d="M160 560L390 360L390 650H160Z" fill="${theme.accent}" opacity="0.9" />
      <path d="M370 650V280L640 120V650Z" fill="rgba(255,255,255,0.24)" />
      <path d="M620 650V320L930 220V650Z" fill="rgba(0,0,0,0.11)" />
      <rect x="96" y="82" width="258" height="54" rx="27" fill="rgba(255,255,255,0.22)" />
      <text x="128" y="118" fill="white" font-size="30" font-family="Arial, sans-serif">Dobbaballapur Rents</text>
      <text x="96" y="640" fill="white" font-size="62" font-weight="700" font-family="Arial, sans-serif">${safeTitle}</text>
      <text x="96" y="700" fill="rgba(255,255,255,0.88)" font-size="30" font-family="Arial, sans-serif">${safeLocation}</text>
      <text x="96" y="748" fill="rgba(255,255,255,0.88)" font-size="24" font-family="Arial, sans-serif">${type} listing preview</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeListing(listing) {
  const cleanedPhotos = ensurePhotoSlots(
    Array.isArray(listing.photos)
      ? listing.photos.map((photo) => String(photo || "").trim()).filter(Boolean)
      : []
  ).filter(Boolean);

  return {
    id: listing.id || createId(),
    title: String(listing.title || "").trim(),
    type: PROPERTY_TYPES.includes(listing.type) ? listing.type : "House",
    monthlyRent: Number(listing.monthlyRent) || 0,
    advanceAmount: Number(listing.advanceAmount) || 0,
    bedrooms: Number(listing.bedrooms) || 0,
    bathrooms: Number(listing.bathrooms) || 0,
    location: String(listing.location || "").trim(),
    mapLink: String(listing.mapLink || "").trim(),
    contactName: String(listing.contactName || "").trim(),
    contactPhone: String(listing.contactPhone || "").trim(),
    availability: AVAILABILITY_OPTIONS.includes(listing.availability)
      ? listing.availability
      : "Available",
    description: String(listing.description || "").trim(),
    photos: cleanedPhotos,
  };
}

function listingToForm(listing) {
  return {
    title: listing.title,
    type: listing.type,
    monthlyRent: String(listing.monthlyRent),
    advanceAmount: String(listing.advanceAmount),
    bedrooms: String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
    location: listing.location,
    mapLink: listing.mapLink,
    contactName: listing.contactName,
    contactPhone: listing.contactPhone,
    availability: listing.availability,
    description: listing.description,
    photos: ensurePhotoSlots(listing.photos || []),
  };
}

function getListingPhotos(listing) {
  const photos = Array.isArray(listing.photos) ? listing.photos.filter(Boolean) : [];
  return photos.length
    ? photos
    : [createPlaceholderImage(listing.title, listing.location, listing.type)];
}

const sampleListings = [
  normalizeListing({
    id: "sample-1",
    title: "2BHK House Near KSRTC Bus Stand",
    type: "House",
    monthlyRent: 18000,
    advanceAmount: 90000,
    bedrooms: 2,
    bathrooms: 2,
    location: "Bus Stand Road, Dobbaballapur",
    mapLink: "https://maps.google.com/?q=KSRTC+Bus+Stand+Doddaballapura",
    contactName: "Shivakumar",
    contactPhone: "9880012345",
    availability: "Available",
    description: "Independent first-floor home with balcony, borewell water, scooter parking, and easy access to the town bus stand.",
    photos: [
      createPlaceholderImage("2BHK House Near KSRTC Bus Stand", "Bus Stand Road, Dobbaballapur", "House"),
      createPlaceholderImage("Spacious Hall and Balcony", "Town Center", "House"),
    ],
  }),
  normalizeListing({
    id: "sample-2",
    title: "Family Apartment in Bashettihalli",
    type: "Apartment",
    monthlyRent: 23000,
    advanceAmount: 120000,
    bedrooms: 3,
    bathrooms: 2,
    location: "Bashettihalli Main Road, Dobbaballapur",
    mapLink: "https://maps.google.com/?q=Bashettihalli+Doddaballapura",
    contactName: "Lakshmi Narayan",
    contactPhone: "9845127788",
    availability: "Already Rented",
    description: "Semi-furnished apartment with modular kitchen, covered car parking, and quick reach to industrial area offices.",
    photos: [
      createPlaceholderImage("Family Apartment in Bashettihalli", "Bashettihalli Main Road", "Apartment"),
      createPlaceholderImage("Modular Kitchen", "Bashettihalli", "Apartment"),
    ],
  }),
  normalizeListing({
    id: "sample-3",
    title: "Ladies PG Near Railway Station",
    type: "PG",
    monthlyRent: 7800,
    advanceAmount: 15000,
    bedrooms: 1,
    bathrooms: 1,
    location: "Railway Station Road, Dobbaballapur",
    mapLink: "https://maps.google.com/?q=Doddaballapura+Railway+Station",
    contactName: "Asha",
    contactPhone: "9901123344",
    availability: "Available",
    description: "Safe ladies PG with two-sharing rooms, daily breakfast, Wi-Fi, and walkable access to the station and market.",
    photos: [
      createPlaceholderImage("Ladies PG Near Railway Station", "Railway Station Road", "PG"),
      createPlaceholderImage("Shared Room Setup", "Railway Station Area", "PG"),
    ],
  }),
  normalizeListing({
    id: "sample-4",
    title: "1RK Room for Working Bachelors",
    type: "Room",
    monthlyRent: 6500,
    advanceAmount: 25000,
    bedrooms: 1,
    bathrooms: 1,
    location: "D-Cross Layout, Dobbaballapur",
    mapLink: "https://maps.google.com/?q=D+Cross+Doddaballapura",
    contactName: "Manjunath",
    contactPhone: "9739128899",
    availability: "Available",
    description: "Compact room with attached bath, separate meter, and good connectivity for people working in nearby factories and shops.",
    photos: [
      createPlaceholderImage("1RK Room for Working Bachelors", "D-Cross Layout", "Room"),
      createPlaceholderImage("Attached Bath and Utility Area", "D-Cross Layout", "Room"),
    ],
  }),
];

function loadListings() {
  try {
    const storedListings = localStorage.getItem(STORAGE_KEY);
    if (!storedListings) {
      return sampleListings;
    }
    const parsedListings = JSON.parse(storedListings);
    if (!Array.isArray(parsedListings) || !parsedListings.length) {
      return sampleListings;
    }
    return parsedListings.map(normalizeListing);
  } catch (error) {
    return sampleListings;
  }
}

function Navbar({ currentView, isAdminAuthenticated, onAdminOpen, onPublicOpen }) {
  return (
    <div className="sticky-bar">
      <div className="container navbar">
        <button
          className="brand button-link"
          type="button"
          onClick={onPublicOpen}
          aria-label={`${SITE_NAME} home`}
        >
          <span className="brand-mark">DR</span>
          <span className="brand-copy">
            <span className="brand-title">{SITE_NAME}</span>
            <span className="brand-subtitle">Local homes across Dobbaballapur</span>
          </span>
        </button>

        <div className="nav-links">
          {currentView === "public" ? (
            <>
              <a className="nav-link" href="#listings">Listings</a>
              <a className="nav-link" href="#areas">Why locals trust us</a>
              <a className="nav-link" href="#contact-footer">Contact</a>
            </>
          ) : (
            <button className="button button-ghost" type="button" onClick={onPublicOpen}>
              Back to public view
            </button>
          )}

          <button className="button button-secondary" type="button" onClick={onAdminOpen}>
            {isAdminAuthenticated ? "Open Admin Dashboard" : "Admin Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero({ availableCount, totalCount, onBrowseClick, onAdminOpen }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Trusted local rental discovery</p>
          <h1 className="hero-title">{SITE_NAME}</h1>
          <p className="hero-tagline">
            ದೊಡ್ಡಬಳ್ಳಾಪುರದಲ್ಲಿ ಮನೆ ಹುಡುಕೋದು ಈಗ ಸುಲಭ.
            Find homes, PGs, apartments, and rooms with verified local contacts and cleaner details.
          </p>

          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onBrowseClick}>
              Browse available homes
            </button>
            <button className="button button-ghost" type="button" onClick={onAdminOpen}>
              Admin Login
            </button>
          </div>

          <div className="hero-pills">
            <div className="hero-pill">
              <strong>{availableCount}</strong>
              <span>available listings today</span>
            </div>
            <div className="hero-pill">
              <strong>{totalCount}</strong>
              <span>managed listings in storage</span>
            </div>
            <div className="hero-pill">
              <strong>4 areas</strong>
              <span>sample pockets preloaded</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-feature-card">
            <span className="feature-chip">Warm, simple, local-first</span>
            <h2>Homes for families, workers, students, and first-time renters.</h2>
            <p>
              Every property card opens a full detail modal with phone contact, rent, advance,
              bedroom count, notes, and map access.
            </p>
          </div>

          <div className="feature-metrics">
            <div className="feature-metric">
              <strong>Search faster</strong>
              <span>Filter by type, budget, bedrooms, and availability.</span>
            </div>
            <div className="feature-metric">
              <strong>Admin ready</strong>
              <span>Add, edit, and remove listings without a backend.</span>
            </div>
          </div>

          <div className="hero-areas">
            <span className="hero-area-chip">Bus Stand Road</span>
            <span className="hero-area-chip">Bashettihalli</span>
            <span className="hero-area-chip">Railway Station Road</span>
            <span className="hero-area-chip">D-Cross Layout</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPanel({ filters, onFilterChange, onResetFilters, resultsCount }) {
  return (
    <section className="section anchor-section" id="listings">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Search and filter</p>
            <h2 className="section-title">Browse available properties in a few clicks.</h2>
            <p className="section-subtitle">
              Start with a keyword, then narrow the grid by property type, rent range,
              bedroom count, and current availability.
            </p>
          </div>
          <span className="results-note">{resultsCount} matching listings</span>
        </div>

        <div className="filter-panel">
          <div className="filter-grid">
            <div className="field">
              <label htmlFor="search">Search area or title</label>
              <input
                id="search"
                className="input"
                name="search"
                type="text"
                placeholder="Bus Stand, PG, 2BHK..."
                value={filters.search}
                onChange={onFilterChange}
              />
            </div>

            <div className="field">
              <label htmlFor="type">Property type</label>
              <select
                id="type"
                className="select"
                name="type"
                value={filters.type}
                onChange={onFilterChange}
              >
                <option value="All">All types</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="minRent">Min rent</label>
              <input
                id="minRent"
                className="input"
                name="minRent"
                type="number"
                min="0"
                placeholder="0"
                value={filters.minRent}
                onChange={onFilterChange}
              />
            </div>

            <div className="field">
              <label htmlFor="maxRent">Max rent</label>
              <input
                id="maxRent"
                className="input"
                name="maxRent"
                type="number"
                min="0"
                placeholder="25000"
                value={filters.maxRent}
                onChange={onFilterChange}
              />
            </div>

            <div className="field">
              <label htmlFor="bedrooms">Bedrooms</label>
              <select
                id="bedrooms"
                className="select"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={onFilterChange}
              >
                <option value="Any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                className="select"
                name="availability"
                value={filters.availability}
                onChange={onFilterChange}
              >
                <option value="All">All status</option>
                {AVAILABILITY_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions" style={{ marginTop: 18 }}>
            <button className="button button-primary" type="button" onClick={onResetFilters}>
              Reset filters
            </button>
            <span className="results-note">Default view shows available homes first.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ listing, onViewDetails }) {
  const listingPhotos = getListingPhotos(listing);
  const firstImage = listingPhotos[0];
  const isAvailable = listing.availability === "Available";

  return (
    <article className={`property-card ${isAvailable ? "" : "is-rented"}`}>
      <div className="property-image-wrap">
        <img
          className="property-image"
          src={firstImage}
          alt={listing.title}
          onError={(event) => {
            event.currentTarget.src = createPlaceholderImage(
              listing.title,
              listing.location,
              listing.type
            );
          }}
        />
        <div className="image-badges">
          <span className="badge badge-type">{listing.type}</span>
          <span className={`badge ${isAvailable ? "badge-available" : "badge-rented"}`}>
            {listing.availability}
          </span>
        </div>
      </div>

      <div className="property-body">
        <div className="property-title-row">
          <div>
            <h3 className="property-title">{listing.title}</h3>
            <div className="property-location">{listing.location}</div>
          </div>

          <div className="price-block">
            <div className="rent-highlight">{formatCurrency(listing.monthlyRent)}</div>
            <div className="advance-note">Advance {formatCurrency(listing.advanceAmount)}</div>
          </div>
        </div>

        <div className="property-meta">
          <div className="meta-card">{listing.bedrooms} Bedrooms</div>
          <div className="meta-card">{listing.bathrooms} Bathrooms</div>
        </div>

        <div className="card-footer">
          <span className="small-note">Contact revealed inside the details modal.</span>
          <button className="button button-secondary" type="button" onClick={() => onViewDetails(listing)}>
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

function PropertyGrid({ listings, onViewDetails }) {
  if (!listings.length) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3 className="panel-title" style={{ marginBottom: 10 }}>No listings match these filters.</h3>
          <p>
            Try widening the rent range, switching the availability filter to all status,
            or clearing the search text.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="property-grid">
        {listings.map((listing) => (
          <PropertyCard key={listing.id} listing={listing} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}

function InfoSection() {
  return (
    <section className="section anchor-section" id="areas">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why locals use it</p>
            <h2 className="section-title">A straightforward rental portal for one town.</h2>
            <p className="section-subtitle">
              Dobbaballapur Rents keeps the experience grounded: clean pricing, area details,
              real phone numbers, and a lightweight admin flow for fresh listings.
            </p>
          </div>
        </div>

        <div className="info-grid">
          <article className="info-panel">
            <span className="info-icon">01</span>
            <h3>Local area focus</h3>
            <p>
              Highlight pockets like Bus Stand Road, Railway Station Road, Bashettihalli,
              and D-Cross without burying users in irrelevant city-wide noise.
            </p>
          </article>

          <article className="info-panel">
            <span className="info-icon">02</span>
            <h3>Clear contact flow</h3>
            <p>
              Each property opens into a full detail modal with the owner or contact person,
              call button, notes, and optional Google Maps link.
            </p>
          </article>

          <article className="info-panel">
            <span className="info-icon">03</span>
            <h3>No backend needed</h3>
            <p>
              Listings are stored in localStorage, so the portal behaves like a working admin-managed
              site without requiring a server or database.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Footer({ onAdminOpen }) {
  return (
    <footer className="footer" id="contact-footer">
      <div className="container">
        <div className="footer-card">
          <div className="footer-copy">
            <strong>{SITE_NAME}</strong>
            <span>Warm local rentals for Dobbaballapur families, workers, and students.</span>
          </div>

          <div className="filter-actions">
            <a className="button button-ghost" href="tel:+919880012345">General Inquiry</a>
            <button className="button button-secondary" type="button" onClick={onAdminOpen}>
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ListingModal({ listing, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listingPhotos = getListingPhotos(listing);
  const activeImage = listingPhotos[Math.min(activeIndex, listingPhotos.length - 1)];
  const telLink = `tel:${sanitizePhoneNumber(listing.contactPhone)}`;
  const isAvailable = listing.availability === "Available";

  useEffect(() => {
    setActiveIndex(0);
  }, [listing.id]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Property details</p>
            <h2 className="modal-title">{listing.title}</h2>
            <div className="status-inline" style={{ marginTop: 10 }}>
              <span className={`status-dot ${isAvailable ? "available" : "rented"}`}></span>
              {listing.availability}
            </div>
          </div>

          <button className="modal-close" type="button" aria-label="Close details modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-layout">
          <div>
            <img
              className="modal-hero-image"
              src={activeImage}
              alt={listing.title}
              onError={(event) => {
                event.currentTarget.src = createPlaceholderImage(
                  listing.title,
                  listing.location,
                  listing.type
                );
              }}
            />

            <div className="thumbnail-row">
              {listingPhotos.map((photo, index) => (
                <button
                  className="thumbnail-button"
                  key={`${listing.id}-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                >
                  <img
                    className={`thumbnail-image ${index === activeIndex ? "is-active" : ""}`}
                    src={photo}
                    alt={`${listing.title} preview ${index + 1}`}
                    onError={(event) => {
                      event.currentTarget.src = createPlaceholderImage(
                        listing.title,
                        listing.location,
                        listing.type
                      );
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="modal-copy">{listing.description || "No additional notes provided yet."}</p>

            <div className="modal-meta-grid">
              <div className="modal-meta-card">
                <strong>Monthly rent</strong>
                <span>{formatCurrency(listing.monthlyRent)}</span>
              </div>
              <div className="modal-meta-card">
                <strong>Advance amount</strong>
                <span>{formatCurrency(listing.advanceAmount)}</span>
              </div>
              <div className="modal-meta-card">
                <strong>Bedrooms</strong>
                <span>{listing.bedrooms}</span>
              </div>
              <div className="modal-meta-card">
                <strong>Bathrooms</strong>
                <span>{listing.bathrooms}</span>
              </div>
              <div className="modal-meta-card">
                <strong>Property type</strong>
                <span>{listing.type}</span>
              </div>
              <div className="modal-meta-card">
                <strong>Location</strong>
                <span>{listing.location}</span>
              </div>
            </div>

            <div className="modal-contact">
              <strong>Contact details</strong>
              <div className="muted-text">{listing.contactName}</div>
              <div className="muted-text">{listing.contactPhone}</div>
            </div>

            <div className="modal-actions" style={{ marginTop: 18 }}>
              <a className="button button-primary" href={telLink}>
                Call Now
              </a>
              {listing.mapLink ? (
                <a
                  className="button button-ghost"
                  href={listing.mapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Map
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ password, error, onPasswordChange, onSubmit, onBack }) {
  return (
    <section className="admin-page">
      <div className="container login-layout">
        <div className="login-highlight">
          <p className="eyebrow">Password protected admin panel</p>
          <h2 className="panel-title">Manage listings without leaving the browser.</h2>
          <p>
            Add new properties, update rent or availability, edit contact details,
            and remove old records. Everything is saved into localStorage for this device.
          </p>

          <div className="login-list">
            <div className="login-list-item">
              <span className="login-dot"></span>
              <span>Simple demo password flow for local administration</span>
            </div>
            <div className="login-list-item">
              <span className="login-dot"></span>
              <span>Form fields cover title, type, rent, advance, rooms, map, contact, notes, and photos</span>
            </div>
            <div className="login-list-item">
              <span className="login-dot"></span>
              <span>Editable table view with update and delete actions</span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <p className="eyebrow">Admin access</p>
          <h2 className="panel-title">Enter the admin password</h2>
          <p className="admin-helper">
            Demo password: <strong>admin123</strong>
          </p>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                className="input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={onPasswordChange}
              />
            </div>

            {error ? <p className="error-note">{error}</p> : null}

            <div className="login-actions" style={{ marginTop: 18 }}>
              <button className="button button-primary" type="submit">
                Login to dashboard
              </button>
              <button className="button button-ghost" type="button" onClick={onBack}>
                Back to public page
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function AdminDashboard({
  listings,
  editingId,
  formState,
  onFieldChange,
  onSubmit,
  onCancelEdit,
  onEditListing,
  onDeleteListing,
  onLogout,
}) {
  const availableCount = listings.filter((listing) => listing.availability === "Available").length;
  const rentedCount = listings.filter((listing) => listing.availability === "Already Rented").length;

  return (
    <section className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h2 className="section-title">Add, update, or remove Dobbaballapur listings.</h2>
            <p className="section-subtitle">
              Use the form below to publish properties and manage everything in one place.
            </p>
          </div>

          <div className="filter-actions">
            <button className="button button-ghost" type="button" onClick={onLogout}>
              Logout to public view
            </button>
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total listings</span>
              <strong className="stat-number">{listings.length}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Available now</span>
              <strong className="stat-number">{availableCount}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Already rented</span>
              <strong className="stat-number">{rentedCount}</strong>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average monthly rent</span>
              <strong className="stat-number">{formatAverageRent(listings)}</strong>
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: 20 }}>
          <p className="eyebrow">{editingId ? "Edit listing" : "Add a new property"}</p>
          <h3 className="panel-title">
            {editingId ? "Update property details" : "Publish a fresh rental listing"}
          </h3>

          <form onSubmit={onSubmit}>
            <div className="admin-form-grid">
              <div className="field field-wide">
                <label htmlFor="title">Property Title</label>
                <input
                  id="title"
                  className="input"
                  name="title"
                  type="text"
                  placeholder="2BHK House Near Bus Stand"
                  value={formState.title}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="typeSelect">Property Type</label>
                <select id="typeSelect" className="select" name="type" value={formState.type} onChange={onFieldChange}>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="availabilitySelect">Availability Status</label>
                <select
                  id="availabilitySelect"
                  className="select"
                  name="availability"
                  value={formState.availability}
                  onChange={onFieldChange}
                >
                  {AVAILABILITY_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="monthlyRent">Monthly Rent (₹)</label>
                <input
                  id="monthlyRent"
                  className="input"
                  name="monthlyRent"
                  type="number"
                  min="0"
                  placeholder="18000"
                  value={formState.monthlyRent}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="advanceAmount">Advance Amount (₹)</label>
                <input
                  id="advanceAmount"
                  className="input"
                  name="advanceAmount"
                  type="number"
                  min="0"
                  placeholder="90000"
                  value={formState.advanceAmount}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="bedroomsInput">Bedrooms</label>
                <input
                  id="bedroomsInput"
                  className="input"
                  name="bedrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={formState.bedrooms}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="bathroomsInput">Bathrooms</label>
                <input
                  id="bathroomsInput"
                  className="input"
                  name="bathrooms"
                  type="number"
                  min="0"
                  placeholder="2"
                  value={formState.bathrooms}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field field-wide">
                <label htmlFor="locationInput">Location / Area in Dobbaballapur</label>
                <input
                  id="locationInput"
                  className="input"
                  name="location"
                  type="text"
                  placeholder="Bashettihalli Main Road, Dobbaballapur"
                  value={formState.location}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field field-wide">
                <label htmlFor="mapLinkInput">Google Maps Link</label>
                <input
                  id="mapLinkInput"
                  className="input"
                  name="mapLink"
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formState.mapLink}
                  onChange={onFieldChange}
                />
              </div>

              <div className="field">
                <label htmlFor="contactNameInput">Contact Person Name</label>
                <input
                  id="contactNameInput"
                  className="input"
                  name="contactName"
                  type="text"
                  placeholder="Shivakumar"
                  value={formState.contactName}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="contactPhoneInput">Contact Phone Number</label>
                <input
                  id="contactPhoneInput"
                  className="input"
                  name="contactPhone"
                  type="tel"
                  placeholder="9880012345"
                  value={formState.contactPhone}
                  onChange={onFieldChange}
                  required
                />
              </div>

              <div className="field field-wide">
                <span className="field-title">Photo URLs</span>
                <div className="photo-grid">
                  {formState.photos.map((photo, index) => (
                    <input
                      key={`photo-${index}`}
                      className="input"
                      name={`photo-${index}`}
                      type="url"
                      placeholder={`Photo URL ${index + 1} or leave blank for placeholder`}
                      value={photo}
                      onChange={onFieldChange}
                    />
                  ))}
                </div>
              </div>

              <div className="field field-wide">
                <label htmlFor="descriptionInput">Description / Additional Notes</label>
                <textarea
                  id="descriptionInput"
                  className="textarea"
                  name="description"
                  placeholder="Independent floor, balcony, scooter parking, water details..."
                  value={formState.description}
                  onChange={onFieldChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-actions" style={{ marginTop: 18 }}>
              <button className="button button-primary" type="submit">
                {editingId ? "Update Listing" : "Add Listing"}
              </button>
              {editingId ? (
                <button className="button button-ghost" type="button" onClick={onCancelEdit}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="admin-card">
          <p className="eyebrow">All listings</p>
          <h3 className="panel-title">Manage published properties</h3>
          <p className="admin-helper">
            Edit to load a row back into the form. Delete removes it from localStorage immediately.
          </p>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Rent</th>
                  <th>Status</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>
                      <span className="table-title">{listing.title}</span>
                      <span className="table-subline">
                        {listing.type} · {listing.bedrooms}BHK · {listing.bathrooms} Bath
                      </span>
                    </td>
                    <td>
                      <span className="table-title">{formatCurrency(listing.monthlyRent)}</span>
                      <span className="table-subline">
                        Advance {formatCurrency(listing.advanceAmount)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${listing.availability === "Available" ? "badge-available" : "badge-rented"}`}>
                        {listing.availability}
                      </span>
                    </td>
                    <td>
                      <span className="table-title">{listing.contactName}</span>
                      <span className="table-subline">{listing.contactPhone}</span>
                    </td>
                    <td>{listing.location}</td>
                    <td>
                      <div className="table-actions">
                        <button className="button button-secondary" type="button" onClick={() => onEditListing(listing)}>
                          Edit
                        </button>
                        <button className="button button-danger" type="button" onClick={() => onDeleteListing(listing.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [listings, setListings] = useState(loadListings);
  const [currentView, setCurrentView] = useState("public");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formState, setFormState] = useState(emptyFormState);
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    document.title = SITE_NAME;
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    document.body.style.overflow = selectedListing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedListing]);

  const sortedListings = [...listings].sort((left, right) => {
    if (left.availability !== right.availability) {
      return left.availability === "Available" ? -1 : 1;
    }
    return Number(right.monthlyRent) - Number(left.monthlyRent);
  });

  const filteredListings = sortedListings.filter((listing) => {
    const searchText = filters.search.trim().toLowerCase();
    const minRent = Number(filters.minRent) || 0;
    const maxRent = filters.maxRent ? Number(filters.maxRent) : Number.POSITIVE_INFINITY;
    const minBedrooms = filters.bedrooms === "Any" ? 0 : Number(filters.bedrooms) || 0;

    const matchesSearch =
      !searchText ||
      [listing.title, listing.location, listing.description, listing.type]
        .join(" ")
        .toLowerCase()
        .includes(searchText);

    const matchesType = filters.type === "All" || listing.type === filters.type;
    const matchesMinRent = Number(listing.monthlyRent) >= minRent;
    const matchesMaxRent = Number(listing.monthlyRent) <= maxRent;
    const matchesBedrooms = Number(listing.bedrooms) >= minBedrooms;
    const matchesAvailability =
      filters.availability === "All" || listing.availability === filters.availability;

    return (
      matchesSearch &&
      matchesType &&
      matchesMinRent &&
      matchesMaxRent &&
      matchesBedrooms &&
      matchesAvailability
    );
  });

  const availableCount = listings.filter((listing) => listing.availability === "Available").length;

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleResetFilters() {
    setFilters(defaultFilters());
  }

  function openAdminView() {
    setCurrentView("admin");
    setSelectedListing(null);
  }

  function openPublicView() {
    setCurrentView("public");
    setSelectedListing(null);
  }

  function handleAdminLogin(event) {
    event.preventDefault();

    if (loginPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setLoginPassword("");
      setLoginError("");
      return;
    }

    setLoginError("Incorrect password. Use admin123 for this local demo.");
  }

  function handleLogout() {
    setIsAdminAuthenticated(false);
    setCurrentView("public");
    setEditingId("");
    setFormState(emptyFormState());
    setLoginError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    if (name.startsWith("photo-")) {
      const photoIndex = Number(name.split("-")[1]);
      setFormState((currentFormState) => {
        const nextPhotos = [...currentFormState.photos];
        nextPhotos[photoIndex] = value;
        return {
          ...currentFormState,
          photos: nextPhotos,
        };
      });
      return;
    }

    setFormState((currentFormState) => ({
      ...currentFormState,
      [name]: value,
    }));
  }

  function resetAdminForm() {
    setFormState(emptyFormState());
    setEditingId("");
  }

  function handleAdminSubmit(event) {
    event.preventDefault();

    const nextListing = normalizeListing({
      id: editingId || createId(),
      ...formState,
      photos: formState.photos.filter((photo) => photo.trim()),
    });

    setListings((currentListings) => {
      if (editingId) {
        return currentListings.map((listing) => (listing.id === editingId ? nextListing : listing));
      }
      return [nextListing, ...currentListings];
    });

    resetAdminForm();
  }

  function handleEditListing(listing) {
    setEditingId(listing.id);
    setFormState(listingToForm(listing));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteListing(listingId) {
    const targetListing = listings.find((listing) => listing.id === listingId);

    if (!targetListing) {
      return;
    }

    const confirmed = window.confirm(`Delete "${targetListing.title}" from local listings?`);

    if (!confirmed) {
      return;
    }

    setListings((currentListings) => currentListings.filter((listing) => listing.id !== listingId));

    if (editingId === listingId) {
      resetAdminForm();
    }

    if (selectedListing && selectedListing.id === listingId) {
      setSelectedListing(null);
    }
  }

  function handleBrowseClick() {
    const listingsSection = document.getElementById("listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="app-shell">
      <style>{APP_STYLES}</style>

      <Navbar
        currentView={currentView}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminOpen={openAdminView}
        onPublicOpen={openPublicView}
      />

      {currentView === "public" ? (
        <>
          <Hero
            availableCount={availableCount}
            totalCount={listings.length}
            onBrowseClick={handleBrowseClick}
            onAdminOpen={openAdminView}
          />
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            resultsCount={filteredListings.length}
          />
          <PropertyGrid listings={filteredListings} onViewDetails={setSelectedListing} />
          <InfoSection />
          <Footer onAdminOpen={openAdminView} />
        </>
      ) : isAdminAuthenticated ? (
        <AdminDashboard
          listings={sortedListings}
          editingId={editingId}
          formState={formState}
          onFieldChange={handleFormChange}
          onSubmit={handleAdminSubmit}
          onCancelEdit={resetAdminForm}
          onEditListing={handleEditListing}
          onDeleteListing={handleDeleteListing}
          onLogout={handleLogout}
        />
      ) : (
        <AdminLogin
          password={loginPassword}
          error={loginError}
          onPasswordChange={(event) => setLoginPassword(event.target.value)}
          onSubmit={handleAdminLogin}
          onBack={openPublicView}
        />
      )}

      {selectedListing ? (
        <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
      ) : null}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
