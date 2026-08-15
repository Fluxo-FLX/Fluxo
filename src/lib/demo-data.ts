import type { Look, Testimonial } from "./types";

/**
 * Server-only re-export shim. Products and brands now live in the
 * server-authoritative store (src/server/repositories) so admin CRUD is
 * consistent everywhere — this file exists so the many Server
 * Components/Actions that already import "@/lib/demo-data" keep working
 * unchanged. It must NEVER be imported from a "use client" file: a client
 * bundle would get its own disconnected, build-time-frozen copy of
 * whatever these functions returned at compile time, not live server
 * state. Client components that need product/brand data use the
 * catalog-snapshot server action instead (see src/app/actions/catalog.ts).
 */
export {
  getAllBrands,
  getBrand,
} from "@/server/repositories/brand-repository";
export {
  getAllProducts,
  getProduct,
  getProductsByBrand,
  getProductsByCategory,
  getRelatedProducts,
  getSubcategoriesByCategory,
  searchProducts,
} from "@/server/repositories/product-repository";

export const looks: Look[] = [
  {
    slug: "training-look",
    title: "Training Look",
    category: "fitness",
    description: "Camiseta + shorts + boné, pronto para o treino de hoje.",
    productSlugs: ["camiseta-performance-dry", "shorts-training-flex", "bone-performance"],
  },
  {
    slug: "beach-look",
    title: "Beach Look",
    category: "surf",
    description: "Camiseta + boardshort + boné, liberdade para o dia de praia.",
    productSlugs: ["camiseta-tide-surf", "boardshort-fluxo-wave", "bone-surf-classic"],
  },
  {
    slug: "city-look",
    title: "City Look",
    category: "casual",
    description: "Camiseta + calça + boné, estilo para a rotina na cidade.",
    productSlugs: ["camiseta-essential-city", "calca-city-move", "bone-city-basic"],
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Cliente Demo 01",
    city: "Natal, RN",
    rating: 5,
    text: "Depoimento demonstrativo, conteúdo de exemplo para o ambiente de desenvolvimento.",
  },
  {
    name: "Cliente Demo 02",
    city: "Natal, RN",
    rating: 5,
    text: "Depoimento demonstrativo, conteúdo de exemplo para o ambiente de desenvolvimento.",
  },
  {
    name: "Cliente Demo 03",
    city: "Parnamirim, RN",
    rating: 4,
    text: "Depoimento demonstrativo, conteúdo de exemplo para o ambiente de desenvolvimento.",
  },
];
