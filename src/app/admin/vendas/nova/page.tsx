import { ManualSaleForm } from "@/components/admin/manual-sale-form";
import { getAllProducts } from "@/server/repositories/product-repository";

export default async function NewManualSalePage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display mb-2 text-2xl sm:text-3xl">Lançar venda</h1>
      <p className="mb-8 text-sm text-graphite">
        Registre vendas feitas presencialmente ou pelo WhatsApp para manter o estoque e o faturamento em dia.
      </p>
      <ManualSaleForm products={products} />
    </div>
  );
}
