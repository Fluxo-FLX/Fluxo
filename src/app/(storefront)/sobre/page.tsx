import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonLink } from "@/components/button";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Sobre a Fluxo",
  description: "Conheça a Fluxo FLX, curadoria multimarcas de moda lifestyle para quem vive em movimento.",
};

function DumbbellIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10v4M4 8v8M7 9v6h3V9H7Z" />
      <path d="M14 9v6h3V9h-3Z" />
      <path d="M10 12h4" />
      <path d="M20 8v8M22 10v4" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 17c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
      <path d="M4 13.5C9 13.5 9 5 14 5c3 0 3 3 1.5 4.5" />
      <path d="M4 13.5c1.5 0 2.5.5 3.5 1.3" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
      <path d="M2 9h20" />
      <path d="M9 3 7 9l5 12 5-12-2-6" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5 13 13l-3.5 1.5L11 11l3.5-1.5Z" />
      <path d="M12 2.5v1M12 20.5v1M2.5 12h1M20.5 12h1" />
    </svg>
  );
}

function ConnectionIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M3 20c0-3 2.2-5 5-5s5 2 5 5" />
      <path d="M14 20c.2-2.3 1.6-4 3.5-4 2 0 3.5 1.8 3.5 4" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17 9 11l4 4 8-9" />
      <path d="M16 6h5v5" />
    </svg>
  );
}

const VALUES = [
  { title: "Movimento", description: "A base de tudo. Treino, praia, cidade: sempre em fluxo.", icon: <DumbbellIcon /> },
  { title: "Liberdade", description: "Estilo que acompanha a vida, sem se prender a um único momento do dia.", icon: <WaveIcon /> },
  { title: "Qualidade", description: "Peças e marcas selecionadas pelo padrão, não pelo volume.", icon: <DiamondIcon /> },
  { title: "Autenticidade", description: "Curadoria real, sem inventar história para marcas que não existem.", icon: <CompassIcon /> },
  { title: "Conexão", description: "Entre estilos de vida diferentes que, no fundo, são a mesma pessoa.", icon: <ConnectionIcon /> },
  { title: "Evolução", description: "A curadoria cresce junto com quem a usa.", icon: <TrendIcon /> },
];

export default function SobrePage() {
  return (
    <div>
      <section className="relative flex h-72 items-end overflow-hidden bg-ink text-paper sm:h-96">
        <PlaceholderPhoto tone="lifestyle" className="absolute inset-0 h-full w-full" demoTag={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <p className="label-caps text-xs text-sand">Institucional</p>
          <h1 className="font-display mt-2 text-4xl sm:text-5xl">Sobre a Fluxo</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Sobre a Fluxo" }]} />
        <SectionHeading eyebrow="Quem somos" title="Uma curadoria, não uma marca de roupas" className="mb-6" />
        <div className="space-y-4 text-graphite">
          <p>
            A Fluxo FLX é uma loja multimarcas de moda lifestyle. Não fabricamos as peças que vendemos:
            selecionamos marcas parceiras que representam performance, autenticidade e liberdade, e reunimos
            tudo em um só lugar.
          </p>
          <p>
            A ideia nasceu de uma observação simples: a mesma pessoa treina de manhã, vai à praia à tarde e
            encontra amigos à noite, e continua sendo ela mesma em cada um desses momentos. A Fluxo FLX existe
            para acompanhar esse movimento, conectando fitness, surf e casual em uma única curadoria.
          </p>
          <p>
            Hoje trabalhamos com marcas demonstrativas enquanto construímos as parcerias reais da plataforma.
            A estrutura já está pronta para receber marcas de moda feminina, acessórios, calçados e outras
            categorias no futuro, sem precisar reconstruir a loja.
          </p>
        </div>
      </section>

      <section className="bg-mist/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="O que nos guia" title="Valores da Fluxo FLX" align="center" className="mx-auto mb-12" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="border border-mist bg-paper p-6">
                <div className="text-petrol">{value.icon}</div>
                <p className="font-display mt-3 text-lg">{value.title}</p>
                <span className="mt-2 block h-0.5 w-6 bg-petrol" />
                <p className="mt-3 text-sm text-graphite">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="font-display text-2xl">Seu ritmo. Seu estilo.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/marcas" variant="primary">
            Conheça as marcas
          </ButtonLink>
          <ButtonLink href="/manifesto" variant="secondary">
            Ler o manifesto
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
