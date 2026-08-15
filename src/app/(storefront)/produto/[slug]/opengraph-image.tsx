import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/demo-data";
import { formatPrice } from "@/lib/format";

const size = { width: 1200, height: 630 };
const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return [{ id: "main", alt: product ? product.name : "Fluxo FLX", size, contentType }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

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
          background: "linear-gradient(135deg, #111111 0%, #0f5b5b 55%, #d8cbb7 100%)",
          padding: "90px",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#ffffff", marginBottom: 16 }}>FLX</div>
        {product ? (
          <>
            <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#ffffff", opacity: 0.75 }}>
              {product.brandName}
            </div>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#ffffff", marginTop: 12, maxWidth: 900 }}>
              {product.name}
            </div>
            <div style={{ display: "flex", fontSize: 42, color: "#ffffff", marginTop: 24 }}>
              {formatPrice(product.price)}
            </div>
          </>
        ) : (
          <div style={{ display: "flex", fontSize: 48, color: "#ffffff" }}>Seu ritmo. Seu estilo.</div>
        )}
      </div>
    ),
    { ...size },
  );
}
