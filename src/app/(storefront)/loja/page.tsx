import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CatalogView } from "@/components/catalog-view";
import { getAllBrands, getAllProducts } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Loja",
  description: "Explore toda a curadoria multimarcas da Fluxo FLX: fitness, surf e casual.",
};

export default async function LojaPage({ searchParams }: PageProps<"/loja">) {
  const params = await searchParams;
  const filtro = typeof params.filtro === "string" ? params.filtro : undefined;
  const initialFilter = filtro === "novidades" || filtro === "mais-vendidos" ? filtro : undefined;
  const [products, brands] = await Promise.all([getAllProducts(), getAllBrands()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Loja" }]} />
      <h1 className="font-display mb-10 text-3xl sm:text-4xl">Loja</h1>
      <CatalogView products={products} brands={brands} initialFilter={initialFilter} hideBrandFilter />
    </div>
  );
}
