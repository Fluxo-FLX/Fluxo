import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { findUserById } from "@/server/repositories/user-repository";
import { getAllOrders } from "@/server/repositories/order-repository";
import { formatPrice } from "@/lib/format";
import { round2 } from "@/lib/money";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await findUserById(id);
  if (!user) notFound();

  const allOrders = await getAllOrders();
  const orders = allOrders.filter((o) => o.userEmail.toLowerCase() === user.email.toLowerCase());
  const totalSpent = round2(orders.reduce((sum, o) => sum + o.total, 0));

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Início", href: "/admin" }, { label: "Clientes", href: "/admin/clientes" }, { label: user.name }]}
      />
      <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl">{user.name}</h1>
        <span className={`label-caps text-[10px] ${user.role === "admin" ? "text-petrol" : "text-graphite"}`}>
          {user.role === "admin" ? "Admin" : "Cliente"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="border border-mist p-5">
          <p className="label-caps text-[11px] text-graphite">E-mail</p>
          <p className="mt-2 text-sm">{user.email}</p>
        </div>
        <div className="border border-mist p-5">
          <p className="label-caps text-[11px] text-graphite">Pedidos</p>
          <p className="font-display mt-2 text-2xl">{orders.length}</p>
        </div>
        <div className="border border-mist p-5">
          <p className="label-caps text-[11px] text-graphite">Total gasto</p>
          <p className="font-display mt-2 text-2xl">{formatPrice(totalSpent)}</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="label-caps mb-3 text-[11px] text-graphite">Endereços salvos</p>
        {user.addresses.length === 0 ? (
          <p className="border border-mist p-5 text-sm text-graphite">Nenhum endereço salvo.</p>
        ) : (
          <ul className="space-y-3">
            {user.addresses.map((address) => (
              <li key={address.id} className="border border-mist p-5 text-sm">
                <p className="text-ink">{address.label}</p>
                <p className="text-graphite">{address.recipient}</p>
                <p className="text-graphite">
                  {address.street}, {address.number} · {address.neighborhood}
                </p>
                <p className="text-graphite">
                  {address.city}/{address.state} · {address.zip}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="label-caps text-[11px] text-graphite">Pedidos</p>
          <Link
            href={`/admin/pedidos?q=${encodeURIComponent(user.email)}`}
            className="label-caps text-[11px] text-petrol hover:underline"
          >
            Gerenciar status dos pedidos
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="border border-mist p-5 text-sm text-graphite">Este cliente ainda não fez nenhum pedido.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.id} className="border border-mist p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink">Pedido {order.id}</p>
                    <p className="text-xs text-graphite">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="label-caps text-[10px] text-graphite">{order.status}</span>
                    <span className="text-sm font-medium">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
