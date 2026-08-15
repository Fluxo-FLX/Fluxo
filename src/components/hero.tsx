import { ButtonLink } from "./button";
import { PlaceholderPhoto } from "./placeholder-photo";

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-ink text-paper">
      <PlaceholderPhoto
        tone="lifestyle"
        className="absolute inset-0 h-full w-full"
        sublabel="Treino · Surf · Cidade"
        label="Campanha Fluxo FLX"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

      {/* Fills the empty side of the frame with brand texture until real campaign photography replaces the placeholder. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[3vw] top-1/2 hidden -translate-y-1/2 select-none font-display text-[26vw] leading-none text-paper/[0.07] sm:block"
      >
        FLX
      </span>
      <span
        aria-hidden="true"
        className="label-caps pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap text-[11px] tracking-[0.3em] text-paper/40 lg:block"
      >
        Fitness · Surf · Casual
      </span>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 lg:px-8">
        <p className="label-caps animate-fade-up text-xs text-sand opacity-0">
          Fitness · Surf · Casual
        </p>
        <h1 className="font-display animate-fade-up mt-4 max-w-2xl text-5xl leading-[1.05] tracking-tight opacity-0 sm:text-7xl [animation-delay:0.1s]">
          SEU RITMO.
          <br />
          SEU ESTILO.
        </h1>
        <p className="animate-fade-up mt-6 max-w-md text-base text-paper/80 opacity-0 [animation-delay:0.2s]">
          Uma curadoria de marcas para acompanhar todos os seus movimentos.
        </p>
        <div className="animate-fade-up mt-8 flex flex-wrap gap-4 opacity-0 [animation-delay:0.3s]">
          <ButtonLink href="/loja" variant="primary" className="bg-petrol hover:bg-sand hover:text-ink">
            Explorar coleção
          </ButtonLink>
          <ButtonLink href="/manifesto" variant="primary" className="bg-petrol hover:bg-sand hover:text-ink">
            Conheça a Fluxo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
