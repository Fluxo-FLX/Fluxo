import type { SizeGuideKind } from "@/lib/size-guide";

function TickH({ x, y }: { x: number; y: number }) {
  return <line x1={x} y1={y - 4} x2={x} y2={y + 4} stroke="currentColor" strokeWidth={1.2} />;
}

function MeasureLineH({
  x1,
  x2,
  y,
  label,
  labelY,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  labelY?: number;
}) {
  return (
    <g className="text-petrol">
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 3" />
      <TickH x={x1} y={y} />
      <TickH x={x2} y={y} />
      <text
        x={(x1 + x2) / 2}
        y={labelY ?? y - 8}
        textAnchor="middle"
        fontSize={9}
        letterSpacing="0.04em"
        fill="currentColor"
        className="uppercase"
      >
        {label}
      </text>
    </g>
  );
}

function MeasureLineV({
  x,
  y1,
  y2,
  label,
  labelX,
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  labelX?: number;
}) {
  return (
    <g className="text-petrol">
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="currentColor" strokeWidth={1.2} strokeDasharray="3 3" />
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke="currentColor" strokeWidth={1.2} />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke="currentColor" strokeWidth={1.2} />
      <text
        x={labelX ?? x + 10}
        y={(y1 + y2) / 2}
        textAnchor="start"
        fontSize={9}
        letterSpacing="0.04em"
        fill="currentColor"
        className="uppercase"
        transform={`rotate(90, ${labelX ?? x + 10}, ${(y1 + y2) / 2})`}
      >
        {label}
      </text>
    </g>
  );
}

function CamisetaDiagram() {
  return (
    <svg width={170} height={190} viewBox="0 0 170 190" fill="none" className="text-ink">
      <path
        d="M56,18 L40,30 L18,58 L34,70 L34,165 L126,165 L126,70 L142,58 L120,30 L104,18 L92,26 L68,26 Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <MeasureLineH x1={104} x2={142} y={44} label="Alt. manga" labelY={38} />
      <MeasureLineH x1={34} x2={126} y={95} label="Tórax" />
      <MeasureLineH x1={34} x2={126} y={158} label="Barra" labelY={178} />
    </svg>
  );
}

function ShortsDiagram() {
  return (
    <svg width={170} height={190} viewBox="0 0 170 190" fill="none" className="text-ink">
      <path
        d="M35,20 L125,20 L125,150 L95,150 L95,95 L80,88 L65,95 L65,150 L35,150 Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <MeasureLineH x1={35} x2={125} y={12} label="Cintura" labelY={8} />
      <MeasureLineH x1={35} x2={125} y={55} label="Quadril" />
      <MeasureLineV x={140} y1={20} y2={150} label="Comprimento" />
    </svg>
  );
}

function CalcaDiagram() {
  return (
    <svg width={170} height={220} viewBox="0 0 170 220" fill="none" className="text-ink">
      <path
        d="M45,20 L115,20 L112,210 L92,210 L92,100 L80,95 L68,100 L68,210 L48,210 Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <MeasureLineH x1={45} x2={115} y={12} label="Cintura" labelY={8} />
      <MeasureLineH x1={45} x2={115} y={55} label="Quadril" />
      <MeasureLineV x={130} y1={20} y2={210} label="Comprimento" />
    </svg>
  );
}

export function GarmentDiagram({ kind }: { kind: Exclude<SizeGuideKind, "unico"> }) {
  if (kind === "camiseta") return <CamisetaDiagram />;
  if (kind === "shorts") return <ShortsDiagram />;
  return <CalcaDiagram />;
}
