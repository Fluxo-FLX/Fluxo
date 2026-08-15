import Link from "next/link";
import { getAllUsers } from "@/server/repositories/user-repository";
import { getAllOrders } from "@/server/repositories/order-repository";
import { formatPrice } from "@/lib/format";
import { round2 } from "@/lib/money";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";

  const [users, orders] = await Promise.all([getAllUsers(), getAllOrders()]);

  const rows = users
    .filter((u) => !query || u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
    .map((user) => {
      const userOrders = orders.filter((o) => o.userEmail.toLowerCase() === user.email.toLowerCase());
      const totalSpent = round2(userOrders.reduce((sum, o) => sum + o.total, 0));
      return { user, orderCount: userOrders.length, totalSpent };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl">Clientes</h1>
        <p className="text-sm text-graphite">{rows.length} de {users.length} cliente(s)</p>
      </div>

      <form className="mb-6 flex flex-wrap gap-3" action="/admin/clientes">
        <input
          type="text"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Buscar por nome ou e-mail"
          className="min-w-[240px] flex-1 border border-mist px-3 py-2.5 text-base outline-none focus:border-petrol sm:text-sm"
        />
        <button
          type="submit"
          className="label-caps border border-ink px-5 py-2.5 text-xs transition-colors hover:bg-ink hover:text-paper"
        >
          Buscar
        </button>
        {params.q && (
          <Link
            href="/admin/clientes"
            className="label-caps flex items-center px-2 text-[11px] text-graphite hover:text-petrol"
          >
            Limpar
          </Link>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="border border-mist px-6 py-16 text-center text-graphite">
          Nenhum cliente encontrado para essa busca.
        </div>
      ) : (
        <div className="overflow-x-auto border border-mist">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-mist bg-mist/30">
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">Nome</th>
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">E-mail</th>
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">Papel</th>
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">Pedidos</th>
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">Total gasto</th>
                <th className="label-caps px-4 py-3 text-[11px] text-graphite">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {rows.map(({ user, orderCount, totalSpent }) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/clientes/${user.id}`} className="hover:text-petrol">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-graphite">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`label-caps text-[10px] ${user.role === "admin" ? "text-petrol" : "text-graphite"}`}>
                      {user.role === "admin" ? "Admin" : "Cliente"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{orderCount}</td>
                  <td className="px-4 py-3">{formatPrice(totalSpent)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clientes/${user.id}`}
                      className="label-caps text-[11px] text-graphite hover:text-petrol"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
