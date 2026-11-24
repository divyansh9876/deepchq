import { ImageResponse } from "next/og";
import { BRAND_NAME } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 };
const size = OG_SIZE;

export function ogCard(kicker: string, title: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#1d1150 0%,#3d22a6 45%,#8a1fa6 80%,#b4235e 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "white", color: "#5a36f0", display: "flex", alignItems: "center", justifyContent: "center" }}>D</div>
          {BRAND_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 28, color: "#f0abfc", textTransform: "uppercase", letterSpacing: 3 }}>{kicker}</div>
          <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#cbd5e1" }}>
          {["ChatGPT", "Perplexity", "AI Overviews", "Gemini", "Claude", "Copilot"].map((e) => (
            <div key={e} style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.3)" }}>{e}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}

