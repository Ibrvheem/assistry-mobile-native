import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface DualAvatarProps {
  leftImage?: string;
  rightImage?: string;
  size?: number;
}

/**
 * DualAvatar — renders two vertically split circular halves.
 * Each half centers its image correctly, preserving faces or focal content.
 */
export const DualAvatar: React.FC<DualAvatarProps> = ({
  leftImage,
  rightImage,
  size = 55,
}) => {
  const radius = size / 2;
  const placeholder =
    "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png";

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      {/* Left Half */}
      <View
        style={[
          styles.half,
          {
            left: 0,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
          },
        ]}
      >
        <Image
          source={{ uri: leftImage || placeholder }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
      </View>

      {/* Right Half */}
      <View
        style={[
          styles.half,
          {
            right: 0,
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
          },
        ]}
      >
        <Image
          source={{ uri: rightImage || placeholder }}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
      </View>
    </View>
  );
};

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  half: {
    position: "absolute",
    top: 0,
    width: "49%",
    height: "100%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "200%", // ensures central part of image is visible even on the half
    height: "100%",
    alignSelf: "center",
  },
});

