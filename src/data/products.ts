export type StrainType = "Indica" | "Sativa" | "Hybrid";

export type Flavor = {
  id: string;
  name: string;
  line: string;
  type: StrainType;
  tagline: string;
  boxColor: string;
  boxAccent: string;
  penColor: string;
  genetics: string[];
  taste: string[];
  effects: string[];
  terps: string[];
};

export const flavors: Flavor[] = [
  {
    id: "blueberry-lemon-haze",
    name: "Blueberry Lemon Haze",
    line: "Signature Line",
    type: "Sativa",
    tagline: "Sweet and sour, uplifting from the first pull",
    boxColor: "#1c4fd6",
    boxAccent: "#f7c600",
    penColor: "#2352c9",
    genetics: ["Blueberry", "Super Lemon Haze"],
    taste: ["Berry", "Sweet", "Sour"],
    effects: ["Happy", "Uplifted", "Energized"],
    terps: ["Limonene", "Terpinolene", "Caryophyllene"],
  },
  {
    id: "berry-white",
    name: "Berry White",
    line: "Signature Line",
    type: "Indica",
    tagline: "Deep berry sweetness with a heavy, relaxed finish",
    boxColor: "#151821",
    boxAccent: "#cba05a",
    penColor: "#23283a",
    genetics: ["Blueberry", "White Widow"],
    taste: ["Berry", "Earthy", "Sweet"],
    effects: ["Relaxed", "Calm", "Sleepy"],
    terps: ["Myrcene", "Pinene", "Linalool"],
  },
  {
    id: "blackberry-og",
    name: "Blackberry OG",
    line: "Signature Line",
    type: "Indica",
    tagline: "Dark fruit and diesel over a heavy OG backbone",
    boxColor: "#0d0d0f",
    boxAccent: "#cba05a",
    penColor: "#1a1a1d",
    genetics: ["Blackberry Kush", "OG Kush"],
    taste: ["Grape", "Diesel", "Earthy"],
    effects: ["Relaxed", "Heavy", "Sleepy"],
    terps: ["Myrcene", "Caryophyllene", "Humulene"],
  },
  {
    id: "cantaloupe-dream",
    name: "Cantaloupe Dream",
    line: "Signature Line",
    type: "Hybrid",
    tagline: "Melon-forward and balanced, easy all day long",
    boxColor: "#cbb98d",
    boxAccent: "#0a0a0a",
    penColor: "#d8c79b",
    genetics: ["Cantaloupe Haze", "Blue Dream"],
    taste: ["Melon", "Sweet", "Tropical"],
    effects: ["Balanced", "Focused", "Social"],
    terps: ["Limonene", "Myrcene", "Ocimene"],
  },
  {
    id: "forbidden-apple",
    name: "Forbidden Apple",
    line: "Signature Line",
    type: "Indica",
    tagline: "Crisp apple candy with a slow, heavy body melt",
    boxColor: "#8f1830",
    boxAccent: "#f7c600",
    penColor: "#a3213c",
    genetics: ["Forbidden Fruit", "Granddaddy Purple"],
    taste: ["Apple", "Candy", "Tart"],
    effects: ["Relaxed", "Euphoric", "Sleepy"],
    terps: ["Myrcene", "Linalool", "Caryophyllene"],
  },
  {
    id: "guavalicious",
    name: "Guavalicious",
    line: "Signature Line",
    type: "Sativa",
    tagline: "Tropical guava sweetness with a bright, social lift",
    boxColor: "#e0607a",
    boxAccent: "#ffffff",
    penColor: "#e97d94",
    genetics: ["Guava", "Tropicana Cookies"],
    taste: ["Guava", "Citrus", "Tropical"],
    effects: ["Uplifted", "Social", "Creative"],
    terps: ["Limonene", "Terpinolene", "Pinene"],
  },
  {
    id: "lime-sherbanger",
    name: "Lime Sherbanger",
    line: "Signature Line",
    type: "Indica",
    tagline: "Citrus and cream over a heavy Sherbet base",
    boxColor: "#2f8f3f",
    boxAccent: "#f7c600",
    penColor: "#3aa54b",
    genetics: ["Lime Sherbet", "Grease Monkey"],
    taste: ["Lime", "Creamy", "Citrus"],
    effects: ["Relaxed", "Happy", "Hungry"],
    terps: ["Limonene", "Myrcene", "Caryophyllene"],
  },
  {
    id: "mango-diesel",
    name: "Mango Diesel",
    line: "Signature Line",
    type: "Sativa",
    tagline: "Ripe mango over a fuel-forward Diesel edge",
    boxColor: "#f2c11a",
    boxAccent: "#0a0a0a",
    penColor: "#f6cf3f",
    genetics: ["Mango", "Sour Diesel"],
    taste: ["Mango", "Diesel", "Tropical"],
    effects: ["Energized", "Focused", "Uplifted"],
    terps: ["Limonene", "Caryophyllene", "Myrcene"],
  },
];

export const heroFlavor = flavors[0];

export const productLines = [
  { name: "Signature Line", swatch: "#1c4fd6" },
  { name: "Live Reserve Line", swatch: "#cba05a" },
  { name: "Rosin Line", swatch: "#c07a86" },
  { name: "Balanced Line", swatch: "#8fb6c9" },
  { name: "State Exclusives", swatch: "#e0607a" },
  { name: "Collabs", swatch: "#7a3a52" },
];

export const attributeCategories = [
  { key: "genetics", label: "Genetics", blurb: "Parent strains behind this cross." },
  { key: "type", label: "Type", blurb: "Indica, Sativa or Hybrid classification." },
  { key: "taste", label: "Taste", blurb: "What you'll notice on the exhale." },
  { key: "effects", label: "Effects", blurb: "The experience this flavor is built for." },
  { key: "terps", label: "Terps", blurb: "The terpenes driving flavor and effect." },
] as const;

export const labSpecs = [
  { label: "Batch", value: "DI-2408-BLH" },
  { label: "Extraction method", value: "Live Resin, solventless" },
  { label: "Hardware", value: "All-in-one, ceramic coil" },
  { label: "Total cannabinoids", value: "~90% (illustrative)" },
  { label: "Strain type", value: "Sativa" },
  { label: "Size options", value: "1G, 2G" },
  { label: "Available in", value: "CA, OK, AZ, NM, NJ, NY, MO, MA" },
  { label: "Lab tested", value: "Every batch, third-party" },
];

export const pillars = [
  { name: "30+ Awards", blurb: "Recognized across leading cannabis publications and cups." },
  { name: "Licensed Facilities", blurb: "Manufactured and packaged in fully licensed, compliant facilities." },
  { name: "Lab Tested", blurb: "Every batch is third-party tested before it reaches a shelf." },
  { name: "Farm Direct", blurb: "Sourced from cultivators we work with directly, batch to batch." },
];

export const faqs = [
  {
    q: "What's the difference between Indica, Sativa, and Hybrid?",
    a: "Indica flavors trend toward relaxed, heavy-body effects. Sativa flavors trend toward energized, uplifted effects. Hybrids blend both, leaning whichever way their genetics point.",
  },
  {
    q: "How do I know a product is authentic?",
    a: "Every unit ships with a batch code you can look up to confirm it's genuine and see its lab results.",
  },
  {
    q: "What sizes are available?",
    a: "Most flavors come in 1G and 2G all-in-one devices, with select flavors available in additional formats.",
  },
  {
    q: "Where can I find these products?",
    a: "Availability varies by state — check a retailer locator for licensed dispensaries carrying this lineup near you.",
  },
];
