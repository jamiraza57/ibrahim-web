import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Generated placeholder monogram — swap for real brand mark art when available.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontFamily: "serif",
            color: "#D4AF37",
            lineHeight: 1,
          }}
        >
          I
        </span>
      </div>
    ),
    { ...size }
  );
}
