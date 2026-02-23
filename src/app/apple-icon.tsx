import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

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
          borderRadius: 32,
          background: "#1A1A1A",
          color: "#FAFAF8",
          fontFamily: "system-ui, sans-serif",
          fontSize: 124,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        V
      </div>
    ),
    size,
  );
}
