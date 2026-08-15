import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonLink } from "@/components/button";
import { ReorderButton } from "@/components/reorder-button";
import { formatPrice } from "@/lib/format";
import { findOrdersByEmail } from "@/server/repositories/order-repository";

export const metadata: Metadata = {
  title: "Meus pedidos",
};

export default async function PedidosPage() {
  const session = await auth();
  const orders = session?.user?.email ? await findOrdersByEmail(session.user.email) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Minha conta", href: "/conta" },
          { label: "Meus pedidos" },
        ]}
      />
      <h1 className="font-display mb-10 text-3xl sm:text-4xl">Meus pedidos</h1>

      {orders.length === 0 ? (
        <div className="border border-mist px-6 py-20 text-center">
          <p className="text-graphite">Você ainda não fez nenhum pedido.</p>
          <ButtonLink href="/loja" variant="primary" className="mt-6 inline-flex">
            Explorar loja
          </ButtonLink>
        </div>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border border-mist p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist pb-4">
                <div>
                  <p className="text-sm text-ink">Pedido {order.id}</p>
                  <p className="text-xs text-graphite">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="label-caps bg-petrol px-3 py-1.5 text-[10px] text-paper">{order.status}</span>
              </div>

              <ul className="divide-y divide-mist">
                {order.items.map((item) => (
                  <li key={`${item.productSlug}-${item.color}-${item.size}`} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <Link href={`/produto/${item.productSlug}`} className="hover:text-petrol">
                        {item.name}
                      </Link>
                      <p className="text-xs text-graphite">
                        {item.brandName} · {item.color} · {item.size} · Qtd {item.quantity}
                      </p>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 space-y-1 border-t border-mist pt-4 text-sm">
                {order.discount > 0 && (
                  <div className="flex justify-between text-petrol">
                    <span>Desconto {order.couponCode ? `(${order.couponCode})` : ""}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium">
                  <span className="text-graphite">Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {order.tracking && (
                <p className="mt-4 text-xs text-graphite">
                  Código de rastreio: <span className="text-ink">{order.tracking}</span>
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5">
                <Link
                  href={`/rastreamento?pedido=${order.id}`}
                  className="label-caps mt-2 inline-block text-[11px] text-petrol hover:underline"
                >
                  Rastrear pedido
                </Link>
                <ReorderButton items={order.items} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
