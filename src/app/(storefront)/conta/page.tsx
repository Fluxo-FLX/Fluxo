import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/breadcrumb";
import { SignOutButton } from "@/components/sign-out-button";
import { findUserByEmail } from "@/server/repositories/user-repository";

export const metadata: Metadata = {
  title: "Minha conta",
};

export default async function ContaPage() {
  const session = await auth();
  const user = session?.user?.email ? await findUserByEmail(session.user.email) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Minha conta" }]} />
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-3xl sm:text-4xl">Minha conta</h1>
        <SignOutButton />
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <section>
          <p className="label-caps mb-3 text-xs text-graphite">Dados pessoais</p>
          <div className="border border-mist p-6 text-sm">
            <p className="text-ink">{session?.user?.name}</p>
            <p className="mt-1 text-graphite">{session?.user?.email}</p>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="label-caps text-xs text-graphite">Endereços</p>
            <Link href="/conta/enderecos" className="label-caps text-[11px] text-petrol hover:underline">
              Gerenciar
            </Link>
          </div>
          <div className="space-y-3 border border-mist p-6 text-sm">
            {user && user.addresses.length > 0 ? (
              user.addresses.slice(0, 2).map((address) => (
                <div key={address.id}>
                  <p className="text-ink">{address.label}</p>
                  <p className="text-graphite">
                    {address.street}, {address.number} · {address.neighborhood}
                  </p>
                  <p className="text-graphite">
                    {address.city}/{address.state} · {address.zip}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-graphite">Nenhum endereço salvo ainda.</p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Link
          href="/conta/pedidos"
          className="label-caps border border-mist p-6 text-center text-xs transition-colors hover:border-petrol hover:text-petrol"
        >
          Meus pedidos
        </Link>
        <Link
          href="/conta/enderecos"
          className="label-caps border border-mist p-6 text-center text-xs transition-colors hover:border-petrol hover:text-petrol"
        >
          Meus endereços
        </Link>
        <Link
          href="/favoritos"
          className="label-caps border border-mist p-6 text-center text-xs transition-colors hover:border-petrol hover:text-petrol"
        >
          Favoritos
        </Link>
        <Link
          href="/loja"
          className="label-caps border border-mist p-6 text-center text-xs transition-colors hover:border-petrol hover:text-petrol"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
