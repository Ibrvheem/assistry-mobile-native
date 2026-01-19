const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#14342B",
    background: "#DBF0DD",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#040617",
    foreground: "#0f172a",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
  brand: {
    primary: "#B0E17C", // Light Green / Lime
    secondary: "#4CAF50", // Standard Green
    darkGreen: "#1A3E2A", // Deep Green
    deepestGreen: "#0d1f16", // Near Black Green
    background: "#000000", // Black
    surface: "rgba(255,255,255,0.1)", // Glassmorphism background
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.8)",
    textMuted: "rgba(255,255,255,0.6)",
    error: "#FF6B6B",
    errorBg: "#2D1A1A",
    gradient: ["#B0E17C", "#4CAF50", "#1A3E2A", "#0d1f16", "#000000"] as const,
    gradientLight: [
      "#B0E17C",
      "#8FD19E",
      "#CBECCF",
      "#EAF7EA",
      "#F4FBEE",
    ] as const,
    gradientLocations: [0, 0.2, 0.5, 0.8, 1],
  },
};
