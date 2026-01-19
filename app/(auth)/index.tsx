
"use client"

import { useEffect, useRef } from "react"
import { View, Text, Animated, Dimensions, StyleSheet, Image, Easing } from "react-native"
import { router } from "expo-router"
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window")

export default function SplashScreen() {
  const logoSlideAnim = useRef(new Animated.Value(-200)).current
  const logoOpacityAnim = useRef(new Animated.Value(0)).current

  const textSlideAnim = useRef(new Animated.Value(-80)).current   // ⬅ start inside logo
  const textOpacityAnim = useRef(new Animated.Value(0)).current

  const descSlideAnim = useRef(new Animated.Value(30)).current    // ⬇ starts below text
  const descOpacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      // 1. Logo anim
      Animated.parallel([
        Animated.timing(logoSlideAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacityAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      // 2. BrandText anim (slides out of logo)
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
      // 3. BrandDesc anim (slides upward from text)
      Animated.parallel([
        Animated.timing(descSlideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(descOpacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/(dashboard)" as any);
        } else {
          router.replace("/(auth)/onboard" as any);
        }
      }, 3000);
    })
  }, [])

  return (
    <View style={styles.container}>
      {/* Background with diagonal green overlay */}
      {/* <View style={styles.background} />
      <View style={styles.diagonalOverlay} /> */}
      <LinearGradient
              colors={Colors.brand.gradient}
              locations={Colors.brand.gradientLocations as any}
              style={styles.background}
            />

      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ translateX: logoSlideAnim }],
              opacity: logoOpacityAnim,
            },
          ]}
        >
          <View style={styles.logoFrame}>
            <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
        </Animated.View>

        {/* Animated BrandText */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateX: textSlideAnim }],
              opacity: textOpacityAnim,
            },
          ]}
        >
          <Text style={styles.brandText}>Assistry</Text>

          {/* Animated BrandDesc */}
          <Animated.View
            style={{
              transform: [{ translateY: descSlideAnim }],
              opacity: descOpacityAnim,
            }}
          >
            <Text style={styles.brandDesc}>Your all in one campus solutions</Text>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#091D17",
  },
  // background: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "#091D17",
  // },

  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  diagonalOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 500,
    width: width * 1,
    height: height,
    backgroundColor: "#4A7C59",
    transform: [{ skewX: "-30deg" }],
    transformOrigin: "top right",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginRight: 20,
  },
  logoFrame: {
    width: 80,
    height: 80,
    marginLeft: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  textContainer: {
    flex: 1,
  },
  brandText: {
    fontSize: 48,
    fontWeight: "600",
    color: "white",
    fontFamily: "System",
    letterSpacing: -1,
  },
  brandDesc: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    fontFamily: "inter",
    letterSpacing: -1,
    fontStyle: "italic",
  },
})
