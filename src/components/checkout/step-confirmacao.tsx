import { ButtonLink } from "../button";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/server/types";

export function StepConfirmacao({ order, isGuest = false }: { order: Order; isGuest?: boolean }) {
  return (
    <div className="flex flex-col items-center border border-mist px-6 py-16 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-petrol text-2xl text-paper">
        ✓
      </span>
      <p className="label-caps text-xs text-petrol">Pedido confirmado</p>
      <h2 className="font-display mt-3 text-3xl">Pedido {order.id}</h2>
      <p className="mt-3 max-w-md text-graphite">
        {isGuest
          ? `Recebemos seu pedido e o pagamento foi aprovado no ambiente simulado. Guarde o número acima para acompanhar pelo rastreamento com o e-mail ${order.userEmail}.`
          : "Recebemos seu pedido e o pagamento foi aprovado no ambiente simulado. Você pode acompanhar o status em Meus pedidos."}
      </p>
      <p className="mt-4 text-lg text-ink">{formatPrice(order.total)}</p>

      {isGuest && (
        <div className="mt-8 max-w-sm border border-mist bg-mist/30 p-5 text-sm">
          <p className="text-ink">Quer acompanhar seus pedidos com mais facilidade?</p>
          <p className="mt-1 text-graphite">Crie uma conta com o e-mail {order.userEmail}, sem preencher nada de novo.</p>
          <ButtonLink
            href={`/cadastro?email=${encodeURIComponent(order.userEmail ?? "")}`}
            variant="secondary"
            className="mt-4"
          >
            Criar conta
          </ButtonLink>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href={isGuest ? `/rastreamento?pedido=${order.id}` : "/conta/pedidos"} variant="primary">
          {isGuest ? "Rastrear meu pedido" : "Ver meus pedidos"}
        </ButtonLink>
        <ButtonLink href="/loja" variant="secondary">
          Continuar comprando
        </ButtonLink>
      </div>
    </div>
  );
}
