import { ImageResponse } from "next/og";

export const alt = "Sara Mitchell, Business and Life Coach for High Performers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share card for every route.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A12",
          backgroundImage:
            "radial-gradient(900px 500px at 80% -10%, rgba(108,99,255,0.22), transparent 60%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", height: 6, width: 180, background: "linear-gradient(90deg, #6C63FF, #A78BFA)", borderRadius: 99 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              color: "#6C63FF",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.18em",
            }}
          >
            BUSINESS &amp; LIFE COACHING
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#F0F0FF", fontSize: 92, fontWeight: 800, letterSpacing: "-0.03em" }}>
              For people done
            </div>
            <div style={{ display: "flex", color: "#A78BFA", fontSize: 92, fontWeight: 800, letterSpacing: "-0.03em" }}>
              playing small.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 99,
              background: "linear-gradient(135deg, #6C63FF, #A78BFA)",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            SM
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#F0F0FF", fontSize: 30, fontWeight: 700 }}>
              Sara Mitchell
            </div>
            <div style={{ display: "flex", color: "#8888AA", fontSize: 22 }}>
              Business &amp; Life Coach for High Performers
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
