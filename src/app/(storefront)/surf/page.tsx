import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CatalogView } from "@/components/catalog-view";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { getAllBrands, getProductsByCategory } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Surf",
  description: "Liberdade, praia e lifestyle. Curadoria surf da Fluxo FLX.",
};

export default async function SurfPage({ searchParams }: PageProps<"/surf">) {
  const params = await searchParams;
  const sub = typeof params.sub === "string" ? params.sub : undefined;
  const products = await getProductsByCategory("surf");
  const brands = await getAllBrands();

  return (
    <div>
      <section className="relative flex h-64 items-end overflow-hidden bg-ink text-paper sm:h-80">
        <PlaceholderPhoto tone="surf" className="absolute inset-0 h-full w-full" demoTag={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl">Surf</h1>
          <p className="mt-2 max-w-md text-paper/80">Liberdade, praia e lifestyle.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Surf" }]} />
        <CatalogView products={products} brands={brands} fixedCategory="surf" initialSubcategory={sub} hideBrandFilter />
      </div>
    </div>
  );
}
