import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f8ff 0%, #edf4ff 45%, #FFE7FF 100%)",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 40,
            height: 40,
          }}
        >
          <div style={{ position: "absolute", top: 12, left: 2, width: 22, height: 10, borderRadius: 10, background: "#f8f8ff" }} />
          <div style={{ position: "absolute", top: 7, left: 9, width: 11, height: 9, borderRadius: 10, background: "#f8f8ff" }} />
          <div style={{ position: "absolute", top: 9, left: 18, width: 8, height: 8, borderRadius: 8, background: "#edf4ff" }} />
          <div style={{ position: "absolute", top: 2, left: 25, width: 9, height: 9, borderRadius: 9, background: "#FFE7FF" }} />
          <div style={{ position: "absolute", top: 12, left: 33, width: 3, height: 3, background: "#dee2ff" }} />
          <div style={{ position: "absolute", top: 11, left: 32, width: 5, height: 1, background: "#dee2ff" }} />
          <div style={{ position: "absolute", top: 10, left: 34, width: 1, height: 5, background: "#dee2ff" }} />
        </div>
      </div>
    ),
    size,
  );
}
