// Industry illustrations bundled in /public/software_development. Used by the
// admin Industries image picker so editors choose an image by name (no upload
// needed). Selecting a row sets the industry's `image` path to the bundled
// asset, which is served frontend-local (see resolveImg in SdIndustries).
const INDUSTRY_IMAGES = [
  { label: "Agriculture", img: "/software_development/agriculture.png" },
  { label: "Automotive", img: "/software_development/automobility.png" },
  { label: "E-commerce", img: "/software_development/ecommerce.png" },
  { label: "Education", img: "/software_development/education.png" },
  { label: "Energy", img: "/software_development/energy.png" },
  { label: "Finance", img: "/software_development/finance.png" },
  { label: "Healthcare", img: "/software_development/healthcare.png" },
  { label: "Hospitality", img: "/software_development/hospitality.png" },
  { label: "Insurance", img: "/software_development/insurance.png" },
  { label: "Manufacturing", img: "/software_development/manufacturing.png" },
  { label: "Media", img: "/software_development/media.png" },
  { label: "Public Sector", img: "/software_development/publicSector.png" },
  { label: "Real Estate", img: "/software_development/real-estate.png" },
  { label: "Supply Chain", img: "/software_development/supply_chain.png" },
  { label: "Telecommunication", img: "/software_development/telecommunication.png" },
];

export default INDUSTRY_IMAGES;
