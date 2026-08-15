import { notFound } from "next/navigation";
import { getBrand } from "@/lib/demo-data";
import { BrandForm } from "@/components/admin/brand-form";
import { updateBrandAction } from "../actions";

export default async function EditBrandPage({ params }: PageProps<"/admin/marcas/[slug]">) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const boundAction = updateBrandAction.bind(null, slug);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display mb-8 text-2xl sm:text-3xl">Editar marca</h1>
      <BrandForm brand={brand} action={boundAction} />
    </div>
  );
}
