import { Hero } from "@/components/hero";
import { CategoryBlock } from "@/components/category-block";
import { SectionHeading } from "@/components/section-heading";
import { ProductGrid } from "@/components/product-grid";
import { LookCard } from "@/components/look-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { FlowLines } from "@/components/flow-lines";
import { ButtonLink } from "@/components/button";
import { getAllProducts, getProduct, looks, testimonials } from "@/lib/demo-data";

export default async function Home() {
  const products = await getAllProducts();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const looksWithProducts = await Promise.all(
    looks.map(async (look) => ({
      look,
      products: (await Promise.all(look.productSlugs.map((slug) => getProduct(slug)))).filter(
        (p): p is NonNullable<typeof p> => Boolean(p),
      ),
    })),
  );

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Do treino à cidade"
          title="Três movimentos, um só estilo"
          subtitle="Fitness, surf e street, marcas selecionadas para acompanhar cada momento do seu dia."
          className="mx-auto mb-12 max-w-2xl"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CategoryBlock
            href="/fitness"
            tone="fitness"
            title="Fitness"
            description="Performance, treino e movimento."
            cta="Explorar Fitness"
            image="/fitness-hero.jpg"
            imagePosition="59% center"
          />
          <CategoryBlock
            href="/surf"
            tone="surf"
            title="Surf"
            description="Liberdade, praia e lifestyle."
            cta="Explorar Surf"
            image="/surf-hero.jpg"
            imagePosition="51% center"
          />
          <CategoryBlock
            href="/street"
            tone="street"
            title="Street"
            description="Estilo para todos os momentos."
            cta="Explorar Street"
            image="/street-hero.jpg"
            imagePosition="51% center"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Recém-chegados" title="Novos movimentos" subtitle="Descubra as novidades que acabaram de chegar à Fluxo." />
          <ButtonLink href="/loja?filtro=novidades" variant="secondary">
            Ver tudo
          </ButtonLink>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      <section className="bg-mist/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Best sellers" title="O que está em movimento" subtitle="Os produtos mais vendidos da curadoria Fluxo." />
            <ButtonLink href="/loja?filtro=mais-vendidos" variant="secondary">
              Ver tudo
            </ButtonLink>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="bg-mist/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Inspire-se"
            title="Looks para o seu fluxo"
            subtitle="Combinações completas pensadas para treino, praia e cidade."
            className="mx-auto mb-12"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {looksWithProducts.map(({ look, products }) => (
              <LookCard key={look.slug} look={look} products={products} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-28 text-paper">
        <FlowLines className="flow-lines-bg absolute inset-0 h-full w-full" variant="light" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="label-caps text-xs text-sand">Manifesto</p>
          <h2 className="font-display mt-4 text-4xl sm:text-5xl">VISTA O MOVIMENTO.</h2>
          <div className="mx-auto mt-8 max-w-xl space-y-2.5 text-lg text-paper/85">
            <p>Movimento não é apenas velocidade. É evolução.</p>
            <p>É treinar quando ninguém está olhando.</p>
            <p>É viver a praia. É explorar a cidade.</p>
            <p>É construir seu próprio estilo.</p>
          </div>
          <p className="mt-8 text-paper/85">
            A Fluxo FLX existe para acompanhar cada momento dessa jornada.
          </p>
          <p className="font-display mt-2 text-2xl">Seu ritmo. Seu estilo.</p>
          <ButtonLink
            href="/manifesto"
            variant="secondary"
            className="mt-8 border-paper text-paper hover:border-sand hover:text-sand"
          >
            Conheça a Fluxo
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="Comunidade" title="Quem vive o fluxo" className="mx-auto mb-12" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="border-t border-mist py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <p className="label-caps text-xs text-petrol">Newsletter</p>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">Entre no fluxo</h2>
          <p className="mt-3 max-w-md text-graphite">
            Receba novidades, lançamentos, marcas e conteúdos selecionados pela Fluxo FLX.
          </p>
          <div className="mt-7">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
