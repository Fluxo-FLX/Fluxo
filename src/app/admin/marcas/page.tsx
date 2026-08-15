import Link from "next/link";
import { getAllBrands } from "@/lib/demo-data";
import { DeleteBrandButton } from "@/components/admin/delete-brand-button";

export default async function AdminBrandsPage() {
  const brands = await getAllBrands();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl">Marcas</h1>
        <Link
          href="/admin/marcas/novo"
          className="label-caps border border-ink px-5 py-3 text-xs transition-colors hover:bg-ink hover:text-paper"
        >
          Nova marca
        </Link>
      </div>

      <div className="overflow-x-auto border border-mist">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-mist bg-mist/30">
              <th className="label-caps px-4 py-3 text-[11px] text-graphite">Marca</th>
              <th className="label-caps px-4 py-3 text-[11px] text-graphite">Categorias</th>
              <th className="label-caps px-4 py-3 text-[11px] text-graphite">Destaque</th>
              <th className="label-caps px-4 py-3 text-[11px] text-graphite">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {brands.map((brand) => (
              <tr key={brand.slug}>
                <td className="px-4 py-3">
                  <Link href={`/admin/marcas/${brand.slug}`} className="hover:text-petrol">
                    {brand.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-graphite">{brand.categories.join(", ")}</td>
                <td className="px-4 py-3 text-graphite capitalize">{brand.accent}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/marcas/${brand.slug}`}
                      className="label-caps text-[11px] text-graphite hover:text-petrol"
                    >
                      Editar
                    </Link>
                    <DeleteBrandButton slug={brand.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
