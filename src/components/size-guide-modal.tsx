"use client";

import { useEffect, useState } from "react";
import { GarmentDiagram } from "./garment-diagram";
import { getSizeGuideKind } from "@/lib/size-guide";
import type { Product } from "@/lib/types";

function RulerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="7" width="18" height="10" rx="1.5" transform="rotate(-8 12 12)" />
      <path d="M7 8.5l0.8 2M10.5 8l0.8 2M14 7.5l0.8 2M17.5 7l0.8 2" transform="rotate(-8 12 12)" />
    </svg>
  );
}

export function SizeGuideModal({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const kind = getSizeGuideKind(product.subcategory);
  const rows = product.sizeGuideRows ?? [];

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group flex items-start gap-2 text-left">
        <span className="mt-0.5 text-graphite transition-colors group-hover:text-petrol">
          <RulerIcon />
        </span>
        <span>
          <span className="label-caps block text-[11px] text-petrol">Guia de tamanhos</span>
          <span className="block text-xs text-graphite">Escolha o tamanho e troque grátis se não servir</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto bg-paper p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg">Tabela de medidas</p>
                <p className="mt-2 text-xs text-graphite">
                  Na dúvida do tamanho, escolha o que você já costuma vestir ou um tamanho acima. Caso não fique
                  ideal, oferecemos troca ou devolução grátis em até 7 dias.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="-m-2 shrink-0 p-2 text-xl leading-none text-graphite hover:text-ink"
              >
                ×
              </button>
            </div>

            {rows.length === 0 ? (
              <p className="text-sm text-graphite">Medidas não cadastradas para este produto.</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-mist">
                  <table className="w-full min-w-[360px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-mist bg-mist/30">
                        <th className="label-caps px-3 py-2 text-[10px] text-graphite">Medidas (cm)</th>
                        {product.sizes.map((s) => (
                          <th key={s} className="label-caps px-3 py-2 text-center text-[10px] text-graphite">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mist">
                      {rows.map((row) => (
                        <tr key={row.label}>
                          <td className="px-3 py-2 text-graphite">{row.label}</td>
                          {product.sizes.map((s) => (
                            <td key={s} className="px-3 py-2 text-center">
                              {row.values[s] ?? "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] text-graphite">Pode haver variação de 1 a 2 cm na costura.</p>
              </>
            )}

            {kind !== "unico" && (
              <div className="mt-5 flex justify-center">
                <GarmentDiagram kind={kind} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
