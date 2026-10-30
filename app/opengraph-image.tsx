import { ImageResponse } from "next/og";

export const alt = "Alok Ram Tripathi, Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#eeebe3",
          color: "#111110",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 18, height: 18, background: "#ff4f1f" }} />
            PORTFOLIO
          </div>
          <div>FULL-STACK · AWS CERTIFIED</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 900, lineHeight: 0.85, letterSpacing: -8 }}>
          <div>ALOK RAM</div>
          <div style={{ display: "flex" }}>
            TRIPATHI<span style={{ color: "#ff4f1f" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #111110", paddingTop: 20, fontSize: 28 }}>
          <div>Next.js · Python · PostgreSQL · RAG · AWS</div>
          <div style={{ color: "#ff4f1f" }}>10,000+ users served</div>
        </div>
      </div>
    ),
    size
  );
}
