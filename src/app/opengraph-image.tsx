import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fluxo FLX - Seu ritmo. Seu estilo.";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #111111 0%, #0f5b5b 100%)",
          padding: "90px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d8cbb7",
            marginBottom: 24,
          }}
        >
          Fitness · Surf · Casual
        </div>
        <div style={{ display: "flex", fontSize: 140, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>FLX</div>
        <div style={{ fontSize: 38, marginTop: 28, color: "#ffffff", opacity: 0.85 }}>Seu ritmo. Seu estilo.</div>
      </div>
    ),
    { ...size },
  );
}
