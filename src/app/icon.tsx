import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Generated placeholder monogram — swap for real brand mark art when available.
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
          background: "#050505",
          border: "1px solid #D4AF37",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            fontSize: 18,
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
