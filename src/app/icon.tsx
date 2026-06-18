import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Generated favicon — the "S." wordmark on the brand gradient.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6C63FF, #A78BFA)",
          color: "#ffffff",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
