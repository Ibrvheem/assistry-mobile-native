const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000000",
    textDim: "rgba(0, 0, 0, 0.6)",
    textMuted: "rgba(0,0,0,0.4)",
    background: "#f7fcf7ff",
    surface: "#FFFFFF",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
    primary: "#B0E17C", // Light Green / Lime
    subprimary: "#14332b",
    secondary: "#4CAF50", // Standard Green
    error: "#FF6B6B",
    gradient: [
      "#B0E17C", // soft brand green
      "#bdf2a7ff",
      "#E8FBE3",
      "#F2FDF0",
      "#FAFFFA",
      // "#FFFFFF",
    ] as const,
    gradientLocations: [0, 0.2, 0.5, 0.8, 1],
  },
  dark: {
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.8)",
    textMuted: "rgba(255,255,255,0.6)",
    background: "#000000",
    surface: "rgba(255,255,255,0.1)",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
    primary: "#B0E17C",
    subprimary: "#B0E17C",
    secondary: "#4CAF50",
    error: "#FF6B6B",
    gradient: ["#B0E17C", "#4CAF50", "#1A3E2A", "#0d1f16", "#000000"] as const,
    gradientLocations: [0, 0.2, 0.5, 0.8, 1],
  },
  // Legacy brand object for backward compatibility during refactor, pointing to Dark theme values mostly
  brand: {
    primary: "#B0E17C",
    secondary: "#4CAF50",
    darkGreen: "#1A3E2A",
    deepestGreen: "#0d1f16",
    background: "#000000",
    surface: "rgba(255,255,255,0.1)",
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.8)",
    textMuted: "rgba(255,255,255,0.6)",
    error: "#FF6B6B",
    errorBg: "#2D1A1A",
    gradient: ["#B0E17C", "#4CAF50", "#1A3E2A", "#0d1f16", "#000000"] as const,
    gradientLight: [
      "#B0E17C",
      "#bdf2a7ff",
      "#E8FBE3",
      "#F2FDF0",
      "#FAFFFA",
      "#FFFFFF",
    ] as const,
    gradientLocations: [0, 0.2, 0.5, 0.8, 1],
  },
};
