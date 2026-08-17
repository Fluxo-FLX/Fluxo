import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CatalogView } from "@/components/catalog-view";
import { getAllBrands, getProductsByCategory } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Street",
  description: "Estilo para todos os momentos. Curadoria street da Fluxo FLX.",
};

export default async function StreetPage({ searchParams }: PageProps<"/street"> ) {
  const params = await searchParams;
  const sub = typeof params.sub === "string" ? params.sub : undefined;
  const products = await getProductsByCategory("street");
  const brands = await getAllBrands();

  return (
    <div>
      <section className="relative flex h-[480px] items-end overflow-hidden bg-ink text-paper sm:h-[780px]">
        <img src="/street-hero.jpg" alt="Street Fluxo FLX" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl">Street</h1>
          <p className="mt-2 max-w-md text-paper/80">Estilo para todos os momentos.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Street" }]} />
        <CatalogView products={products} brands={brands} fixedCategory="street" initialSubcategory={sub} hideBrandFilter />
      </div>
    </div>
  );
}
