import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CatalogView } from "@/components/catalog-view";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { getAllBrands, getBrand, getProductsByBrand } from "@/lib/demo-data";

export async function generateStaticParams() {
  const brands = await getAllBrands();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/marcas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: PageProps<"/marcas/[slug]">) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const products = await getProductsByBrand(brand.slug);

  return (
    <div>
      <section className="relative flex h-64 items-end overflow-hidden bg-ink text-paper sm:h-80">
        <PlaceholderPhoto tone={brand.accent === "sand" ? "surf" : "ink"} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <p className="label-caps text-xs text-sand">Marca parceira</p>
          <h1 className="font-display mt-2 text-4xl sm:text-5xl">{brand.name}</h1>
          <p className="mt-2 max-w-md text-paper/80">{brand.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Marcas", href: "/marcas" }, { label: brand.name }]} />

        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="label-caps mb-2 text-xs text-graphite">Sobre a marca</p>
            <p className="text-graphite">{brand.description}</p>
          </div>
          <div>
            <p className="label-caps mb-2 text-xs text-graphite">História</p>
            <p className="text-graphite">{brand.history}</p>
          </div>
        </div>

        <CatalogView products={products} hideBrandFilter />
      </div>
    </div>
  );
}
