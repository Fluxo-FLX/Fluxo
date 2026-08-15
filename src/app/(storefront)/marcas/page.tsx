import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { BrandCard } from "@/components/brand-card";
import { SectionHeading } from "@/components/section-heading";
import { getAllBrands } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Conheça as marcas que fazem parte da curadoria multimarcas da Fluxo FLX.",
};

export default async function MarcasPage() {
  const brands = await getAllBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Marcas" }]} />
      <SectionHeading
        eyebrow="Curadoria"
        title="Marcas que fazem parte do Fluxo"
        subtitle="Cada marca é selecionada por conectar performance, autenticidade e estilo de vida em movimento."
        className="mb-12"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </div>
  );
}
