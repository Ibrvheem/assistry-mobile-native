
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: "Welcome to Assistry\nTurn Your Time Into Value!",
    description:
      "Where Students Help Students Thrive. Join a community where every student’s skill, time, and effort matter.",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 2,
    title: "Get Help When You Need It\nNo Task Too Big!",
    description:
      "Need notes, help with an assignment, or someone to run a campus errand? Post your task, someone’s always ready to assist.",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: 3,
    title: "Earn While You Assist",
    description:
      "Complete tasks for others, gain experience, build your reputation, and earn incentives you can actually use.",
    image: require("@/assets/images/onboarding3.png"),
  },
  {
    id: 4,
    title: "Built for Students, Powered by You",
    description: "From study groups to daily errands, Assistry makes student life easier, smarter, and more connected.",
    image: require("@/assets/images/onboarding4.png"),
  },
];

const { width: initialWidth } = Dimensions.get("window");

const Onboarding: React.FC = () => {
  // Using state for width to handle rotation, but init with Dimensions.get for immediate value
  const [screenWidth, setScreenWidth] = useState(initialWidth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
     // Handle dimension changes if needed (e.g. rotation)
     const subscription = Dimensions.addEventListener('change', ({ window }) => {
         setScreenWidth(window.width);
     });
     return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % onboardingData.length;
          // Ensure we don't call scrollTo if component unmounted or ref null
          if (scrollViewRef.current) {
             scrollViewRef.current.scrollTo({
                x: nextIndex * screenWidth,
                animated: true,
             });
          }
          return nextIndex;
        });
      }, 3000);
    };

    startAutoSlide();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [screenWidth]); // Restart interval if width changes

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const handleLogin = () => {
    router.push("/(auth)/signin");
  };

  const handleSignUp = () => {
    router.push("/(auth)/signup" as any);
  };

  const renderSlide = (item: OnboardingSlide) => (
    <View key={item.id} style={[styles.slide, { width: screenWidth }]}>
      <View style={styles.imageContainer}>
        {/* Placeholder images might be needed if these don't exist yet, but using what was there */}
        <Image source={item.image} style={styles.illustration} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {onboardingData.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]}
          onPress={() => {
            setCurrentIndex(index);
            scrollViewRef.current?.scrollTo({
              x: index * screenWidth,
              animated: true,
            });
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        {/* Gradient Background */}
      <LinearGradient
        colors={['#B0E17C', '#4CAF50', '#1A3E2A', '#0d1f16', '#000000']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
         <View style={{ marginTop: 12, marginLeft: 24 }}>
            <Image
              source={require("@/assets/logos/logo.png")}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
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
            // Optimization props
            removeClippedSubviews={false} 
          >
            {onboardingData.map((item) => renderSlide(item))}
          </ScrollView>

          {renderPaginationDots()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  illustration: {
    width: 280,
    height: 280,
  },
  textContainer: {
    flex: 0.3,
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#B0E17C",
    width: 20, // stretch effect
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  loginButton: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: "#B0E17C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B0E17C",
  },
  signUpButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#B0E17C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B0E17C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A3E2A",
  },
});

export default Onboarding;
