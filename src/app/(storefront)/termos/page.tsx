import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Termos" }]} />
      <h1 className="font-display mb-8 text-3xl sm:text-4xl">Termos de uso</h1>

      <div className="space-y-6 text-graphite">
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Sobre a plataforma</h2>
          <p>
            A Fluxo FLX é uma curadoria multimarcas. Os produtos anunciados pertencem às marcas parceiras
            listadas em cada página de produto e marca.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Conta e cadastro</h2>
          <p>
            Você é responsável por manter a confidencialidade da sua senha e pelas atividades realizadas na sua
            conta.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Pedidos e pagamento</h2>
          <p>
            Este ambiente utiliza pagamento simulado (sandbox) para fins de demonstração. Nenhuma cobrança real é
            processada.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-sm text-ink label-caps">Propriedade intelectual</h2>
          <p>A marca FLX, seu logotipo e identidade visual pertencem à Fluxo FLX.</p>
        </section>
        <p className="text-xs text-graphite/70">
          Página de conteúdo demonstrativo: o texto final deve ser revisado com o time jurídico antes da
          publicação em produção.
        </p>
      </div>
    </div>
  );
}
