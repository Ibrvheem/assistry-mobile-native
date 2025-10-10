

"use client"

import { router } from "expo-router"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width: screenWidth } = Dimensions.get("window")

interface OnboardingSlide {
  id: number
  title: string
  description: string
  image: any // You'll replace this with your actual images
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Your Journey, Simplified",
    description:
      "Whether you're a passenger looking for a smooth ride, a driver ready to earn, or a stop chief managing operations — We bring you all together. Let's get you started.",
    image: require("@/assets/images/onboarding1.png"), // Replace with your actual image path
  },
  {
    id: 2,
    title: "Safe & Reliable",
    description:
      "Experience secure and dependable transportation with verified drivers and real-time tracking for your peace of mind.",
    image: require("@/assets/images/onboarding2.png"), // Replace with your actual image path
  },
  {
    id: 3,
    title: "Earn While You Drive",
    description:
      "Join our community of drivers and start earning on your schedule. Flexible hours, competitive rates, and instant payments.",
    image: require("@/assets/images/onboarding3.png"), // Replace with your actual image path
  },
  {
    id: 4,
    title: "Ready to Start?",
    description: "Get started today and become part of the transportation revolution. Your journey begins here.",
    image: require("@/assets/images/onboarding4.png"), // Replace with your actual image path
  },
]

const Onboarding: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % onboardingData.length
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          })
          return nextIndex
        })
      }, 3000)
    }

    startAutoSlide()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, []) // Remove currentIndex dependency to prevent restarts

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffsetX / screenWidth)
    setCurrentIndex(index)
  }

  const handleLogin = () => {
    router.push("/(auth)/signin")
    // Handle login navigation
  }

  const handleSignUp = () => {
    // Handle sign up navigation
    router.push("/(auth)/signup" as any)
  }

  const renderSlide = (item: OnboardingSlide, index: number) => (
    <View key={item.id} style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.illustration} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]}
          onPress={() => {
            setCurrentIndex(index)
            scrollViewRef.current?.scrollTo({
              x: index * screenWidth,
              animated: true,
            })
          }}
        />
      ))}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
        <View style={{marginTop:12, marginLeft:12}}>
                      <Image
                        source={require("../../assets/logos/image.png")}
                        style={{ width: 50, height: 50, marginTop: 12 , marginLeft:12}}
                        className="rounded-md"
                      />
         </View>
      <View style={styles.content}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {onboardingData.map((item, index) => renderSlide(item, index))}
        </ScrollView>

        {renderPaginationDots()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth, // Use full screen width for proper spacing
    alignItems: "center",
    justifyContent: "space-between", // Better distribution of content
    paddingHorizontal: 20,
    paddingVertical: 60, // Add vertical padding
  },
  imageContainer: {
    flex: 0.6, // Give more controlled space to image
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  illustration: {
    width: 285,
    height: 270,
  },
  textContainer: {
    flex: 0.3, // Controlled space for text
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center", // Center text vertically in its space
  },
  title: {
    fontFamily: "System", // Use system font as fallback
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    textAlign: "center",
    color: "#2D2D2D",
    marginBottom: 16,
  },
  description: {
    fontFamily: "System", // Use system font as fallback
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    color: "#2D2D2D",
    opacity: 0.6,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100, // Reduced margin for better spacing
    gap: 7,
    paddingHorizontal: 20, // Add horizontal padding
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: "#091D17",
  },
  inactiveDot: {
    backgroundColor: "rgba(13, 27, 64, 0.2)",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 20, // Add horizontal padding for buttons
  },
  loginButton: {
    flex: 1,
    height: 62,
    borderWidth: 2,
    borderColor: "#B0E17C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B0E17C",
  },
  loginButtonText: {
    fontFamily: "ReadexPro-Medium", // Use system font as fallback
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    color: "#14342B",
  },
  signUpButton: {
    flex: 1,
    height: 62,
    backgroundColor: "#091D17",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    fontFamily: "ReadexPro-Medium", // Use system font as fallback
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    color: "#B0E17C",
  },
})

export default Onboarding
