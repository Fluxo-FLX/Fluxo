import type { MetadataRoute } from "next";
import { getAllBrands, getAllProducts } from "@/lib/demo-data";
import { SITE_URL } from "@/lib/site-config";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/loja", priority: 0.9, changeFrequency: "daily" },
  { path: "/fitness", priority: 0.8, changeFrequency: "weekly" },
  { path: "/surf", priority: 0.8, changeFrequency: "weekly" },
  { path: "/street", priority: 0.8, changeFrequency: "weekly" },
  { path: "/marcas", priority: 0.7, changeFrequency: "weekly" },
  { path: "/manifesto", priority: 0.5, changeFrequency: "monthly" },
  { path: "/sobre", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contato", priority: 0.4, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { path: "/trocas-e-devolucoes", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" },
  { path: "/termos", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [brands, products] = await Promise.all([getAllBrands(), getAllProducts()]);

  const brandEntries = brands.map((brand) => ({
    url: `${SITE_URL}/marcas/${brand.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productEntries = products.map((product) => ({
    url: `${SITE_URL}/produto/${product.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...brandEntries, ...productEntries];
}
