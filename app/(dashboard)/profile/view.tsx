import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./services";
import { UserSchema } from "../types";

const fallbackUser = {
  profileImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  department: "Computer Science",
  year: "Senior",
  bio: "Computer Science student passionate about helping fellow students.",
  skills: ["Programming", "Math", "Physics"],
  languages: ["English", "Spanish"],
  availability: "Weekdays after 3 PM",
};

export default function ViewProfileScreen(): JSX.Element {
  const { id } = useLocalSearchParams() as { id?: string };

  // // console.log("Profile ID:", id);

  

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) throw new Error("No user ID provided");
      return getUser(id);
    },
    enabled: !!id,
  });

  // // console.log("User V Data:", user);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ marginTop: 12, color: "#555" }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // if (error || !user) {
  //   return (
  //     <SafeAreaView style={styles.centered}>
  //       <Ionicons name="alert-circle" size={40} color="#ef4444" />
  //       <Text style={{ color: "#ef4444", marginTop: 8 }}>
  //         Failed to load profile.
  //       </Text>
  //       <Pressable
  //         onPress={() => router.back()}
  //         style={styles.retryButton}
  //       >
  //         <Text style={styles.retryText}>Go Back</Text>
  //       </Pressable>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} /> {/* alignment placeholder */}
      </View>

      
        <Animated.View entering={FadeIn.duration(300)}>
          {/* Header Section */}
          {/* <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            style={styles.gradientHeader}
          > */}
             <LinearGradient
                    // colors={["#143428", "#B0E17C", "#1BAE6A"]}
                    colors={["#0F2027", "#2C7744", "#A8E063"]}
                    locations={[0, 0.5, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                     style={styles.gradientHeader}
                  >
            <Image
              source={{
                uri: user?.profile_picture || fallbackUser.profileImage,
              }}
              style={styles.profileImage}
              contentFit="cover"
              transition={300}
            />
            <Text style={styles.name}>
              {user.first_name} {user.last_name}
            </Text>
            {user.reg_no && <Text style={styles.subtext}>{user.reg_no}</Text>}
            <Text style={styles.subtext}>
              {fallbackUser.department} • {fallbackUser.year}
            </Text>
          </LinearGradient>
          <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

          {/* Bio */}
          <ProfileSection title="About">
            <Text style={styles.bodyText}>
              { fallbackUser.bio}
            </Text>
          </ProfileSection>

          {/* Contact */}
          <ProfileSection title="Contact">
            <Text style={styles.infoText}>
              <Ionicons name="mail" size={16} color="#22C55E" /> {user.email}
            </Text>
            {user.phone_no && (
              <Text style={styles.infoText}>
                <Ionicons name="call" size={16} color="#22C55E" />{" "}
                {user.phone_no}
              </Text>
            )}
          </ProfileSection>

          {/* Skills
          <ProfileSection title="Skills">
            <View style={styles.tags}>
              {(fallbackUser.skills).map((skill) => (
                <View key={skill} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>
          </ProfileSection> */}

          {/* Languages */}
          <ProfileSection title="Languages">
            <View style={styles.tags}>
              {(fallbackUser.languages).map((lang) => (
                <View key={lang} style={styles.tag}>
                  <Text style={styles.tagText}>{lang}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>

          {/* Availability */}
          <ProfileSection title="Availability">
            <Text style={styles.bodyText}>
              {fallbackUser.availability}
            </Text>
          </ProfileSection>
          </ScrollView>
        </Animated.View>
      
    </SafeAreaView>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#22C55E",
  },
  retryText: { color: "#fff", fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  scrollContent: { paddingBottom: 32 },
  gradientHeader: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: "700", color: "#fff" },
  subtext: { fontSize: 15, color: "#f0fdf4", marginTop: 4 },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  bodyText: { fontSize: 15, color: "#374151", lineHeight: 22 },
  infoText: { fontSize: 15, color: "#374151", marginBottom: 6 },
  tags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  tag: {
    backgroundColor: "#f0fdf4",
    borderColor: "#22C55E",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: "#22C55E", fontWeight: "500" },
});
