import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";
import { FlowLines } from "@/components/flow-lines";

export const metadata: Metadata = {
  title: "Manifesto",
  description: "Vista o movimento. O manifesto da Fluxo FLX.",
};

export default function ManifestoPage() {
  return (
    <div className="relative overflow-hidden bg-ink py-24 text-paper">
      <FlowLines className="flow-lines-bg absolute inset-0 h-full w-full" variant="light" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="label-caps text-xs text-sand">Manifesto</p>
        <h1 className="font-display mt-4 text-5xl sm:text-6xl">VISTA O MOVIMENTO.</h1>

        <div className="mx-auto mt-10 max-w-xl space-y-2.5 text-lg text-paper/85">
          <p>Movimento não é apenas velocidade. É evolução.</p>
          <p>É treinar quando ninguém está olhando.</p>
          <p>É viver a praia. É explorar a cidade.</p>
          <p>É construir seu próprio estilo.</p>
        </div>

        <p className="mt-10 text-paper/85">
          A Fluxo FLX existe para acompanhar cada momento dessa jornada.
        </p>
        <p className="font-display mt-2 text-2xl">Seu ritmo. Seu estilo.</p>

        <ButtonLink
          href="/loja"
          variant="secondary"
          className="mt-10 border-paper text-paper hover:border-sand hover:text-sand"
        >
          Explorar coleção
        </ButtonLink>
      </div>
    </div>
  );
}
