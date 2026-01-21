// StatusBadge.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

type Palette = { bg: string; dot: string; text: string };

const STATUS_PALETTE = {
  pending: { bg: "#EEDD97", dot: "#D5A247", text: "#df5803" },
  success: { bg: "#DBF0DD", dot: "#18AE6A", text: "#498c00" },
  failed:  { bg: "#FFB6B1", dot: "#D8483D", text: "#d30e0a" },
  default: { bg: "#B0E17C", dot: "#14342B", text: "#14342B" },
} as const; 

const STATUS_PALETTE_DARK = {
  pending: { bg: "rgba(238, 221, 151, 0.2)", dot: "#D5A247", text: "#EEDD97" },
  success: { bg: "rgba(24, 174, 106, 0.2)", dot: "#18AE6A", text: "#4ade80" },
  failed:  { bg: "rgba(216, 72, 61, 0.2)", dot: "#D8483D", text: "#ff6b6b" },
  default: { bg: "rgba(176, 225, 124, 0.2)", dot: "#14342B", text: "#e2e8f0" },
} as const;

type StatusKey = keyof typeof STATUS_PALETTE; 

type Props = {
  status?: string | null;
  style?: ViewStyle;
};

export default function StatusBadge({ status, style }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // normalize incoming status to lowercase string
  const raw = (status ?? "default").toString().toLowerCase();

  // Narrow to the union of known keys, otherwise fall back to 'default'
  const key = (["pending", "success", "failed"].includes(raw)
    ? raw
    : "default") as StatusKey;

  const palette: any = isDark ? STATUS_PALETTE_DARK[key] : STATUS_PALETTE[key];

  // Capitalize each word for display: "pending" => "Pending"
  const label = key.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text
        style={[styles.label, { color: palette.text }]}
        accessibilityLabel={`status ${label}`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 12,
    marginTop: 4,
    alignSelf: "flex-start",
    marginLeft: "auto",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    marginRight: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
  },
});
