import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
};

export default function TrocasEDevolucoesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Trocas e devoluções" }]} />
      <h1 className="font-display mb-8 text-3xl sm:text-4xl">Trocas e devoluções</h1>

      <div className="space-y-6 text-graphite">
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Prazo</h2>
          <p>
            Você tem até 7 dias corridos após o recebimento do pedido para solicitar troca ou devolução, conforme
            o Código de Defesa do Consumidor.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Condições do produto</h2>
          <p>
            O produto deve estar sem uso, com etiquetas e embalagem original, acompanhado da nota fiscal.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Como solicitar</h2>
          <p>
            Acesse Minha conta &gt; Meus pedidos e selecione o pedido desejado, ou entre em contato pela página de{" "}
            <a href="/contato" className="text-petrol hover:underline">
              Contato
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Reembolso</h2>
          <p>
            Após a análise do produto devolvido, o reembolso é processado no mesmo método de pagamento utilizado
            na compra, em até 10 dias úteis.
          </p>
        </section>
        <p className="text-xs text-graphite/70">
          Página de conteúdo demonstrativo: os prazos e condições finais devem ser revisados com o time jurídico
          antes da publicação em produção.
        </p>
      </div>
    </div>
  );
}
