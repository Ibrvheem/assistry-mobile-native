import React from "react";
import Colors from "@/constants/Colors";
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
        <ActivityIndicator size="large" color={Colors.brand.primary} />
        <Text style={{ marginTop: 12, color: Colors.brand.textMuted }}>Loading profile...</Text>
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
          <Ionicons name="arrow-back" size={24} color={Colors.brand.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} /> {/* alignment placeholder */}
      </View>

      
        <View>
          {/* Header Section */}
          {/* <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            style={styles.gradientHeader}
          > */}
          <LinearGradient
            colors={Colors.brand.gradient}
            locations={Colors.brand.gradientLocations as any}
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
              <Ionicons name="mail" size={16} color={Colors.brand.primary} /> {user.email}
            </Text>
            {user.phone_no && (
              <Text style={styles.infoText}>
                <Ionicons name="call" size={16} color={Colors.brand.primary} />{" "}
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
        </View>
      
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
  container: { flex: 1, backgroundColor: Colors.brand.background },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.brand.background,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.brand.primary,
  },
  retryText: { color: Colors.brand.darkGreen, fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: Colors.brand.text },
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
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brand.text,
    marginBottom: 8,
  },
  bodyText: { fontSize: 15, color: Colors.brand.textDim, lineHeight: 22 },
  infoText: { fontSize: 15, color: Colors.brand.textDim, marginBottom: 6 },
  tags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  tag: {
    backgroundColor: Colors.brand.surface,
    borderColor: Colors.brand.primary,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { color: Colors.brand.primary, fontWeight: "500" },
});
