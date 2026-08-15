import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Accordion } from "@/components/accordion";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductGallery } from "@/components/product-gallery";
import { ProductGrid } from "@/components/product-grid";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { RecentlyViewed } from "@/components/recently-viewed";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialCard } from "@/components/testimonial-card";
import {
  getAllProducts,
  getProduct,
  getProductsByCategory,
  getRelatedProducts,
} from "@/lib/demo-data";
import { demoReviews } from "@/lib/reviews";
import { SITE_URL } from "@/lib/site-config";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [related, categoryProducts] = await Promise.all([
    getRelatedProducts(product),
    getProductsByCategory(product.category),
  ]);
  const youMayLike = categoryProducts
    .filter((p) => p.slug !== product.slug && !related.some((r) => r.slug === p.slug))
    .slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brandName },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/produto/${product.slug}`,
    },
    // No aggregateRating here: the on-page review stats are synthetic demo
    // data (see lib/reviews.ts). Publishing fake ratings in structured data
    // that search engines index is both misleading and a rich-results
    // policy violation — add this back only once reviews are real.
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Loja", href: "/loja" },
          { label: product.brandName, href: `/marcas/${product.brandSlug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Accordion
            items={[
              { title: "Descrição", content: product.description },
              {
                title: "Características e composição",
                content: (
                  <ul className="space-y-1">
                    <li>Categoria: {product.subcategory}</li>
                    <li>Composição: {product.composition}</li>
                  </ul>
                ),
              },
              {
                title: "Cuidados",
                content: (
                  <ul className="list-inside list-disc space-y-1">
                    {product.care.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>

      <section id="avaliacoes" className="mt-16 border-t border-mist pt-12">
        <SectionHeading eyebrow="Avaliações" title="O que dizem sobre esse produto" className="mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {demoReviews.map((review, i) => (
            <TestimonialCard
              key={i}
              testimonial={{ name: review.author, city: "DEMO", rating: review.rating, text: review.text }}
            />
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-mist pt-12">
          <SectionHeading eyebrow="Cross-selling" title="Complete seu look" className="mb-8" />
          <ProductGrid products={related} />
        </section>
      )}

      {youMayLike.length > 0 && (
        <section className="mt-16 border-t border-mist pt-12">
          <SectionHeading title="Você também pode gostar" className="mb-8" />
          <ProductGrid products={youMayLike} />
        </section>
      )}

      <RecentlyViewed currentSlug={product.slug} />
    </div>
  );
}
