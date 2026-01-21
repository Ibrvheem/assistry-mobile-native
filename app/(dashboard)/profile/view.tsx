import React from "react";
import Colors from "@/constants/Colors";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "./services";
import { UserSchema } from "../types";
import { useColorScheme } from "@/components/useColorScheme";

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
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

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
      <SafeAreaView style={[styles.centered, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ marginTop: 12, color: themeColors.textMuted }}>Loading profile...</Text>
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
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Profile</Text>
        <View style={{ width: 40 }} /> {/* alignment placeholder */}
      </View>

      
        <View>
          {/* Header Section */}
          {/* <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            style={styles.gradientHeader}
          > */}
          <LinearGradient
            colors={themeColors.gradient}
            locations={themeColors.gradientLocations as any}
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
          <ProfileSection title="About" color={themeColors.text} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
            <Text style={[styles.bodyText, { color: themeColors.textDim }]}>
              { fallbackUser.bio}
            </Text>
          </ProfileSection>

          {/* Contact */}
          <ProfileSection title="Contact" color={themeColors.text} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
            <Text style={[styles.infoText, { color: themeColors.textDim }]}>
              <Ionicons name="mail" size={16} color={themeColors.primary} /> {user.email}
            </Text>
            {user.phone_no && (
              <Text style={[styles.infoText, { color: themeColors.textDim }]}>
                <Ionicons name="call" size={16} color={themeColors.primary} />{" "}
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
          <ProfileSection title="Languages" color={themeColors.text} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
            <View style={styles.tags}>
              {(fallbackUser.languages).map((lang) => (
                <View key={lang} style={[styles.tag, { backgroundColor: themeColors.surface, borderColor: themeColors.primary }]}>
                  <Text style={[styles.tagText, { color: themeColors.primary }]}>{lang}</Text>
                </View>
              ))}
            </View>
          </ProfileSection>

          {/* Availability */}
          <ProfileSection title="Availability" color={themeColors.text} borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}>
            <Text style={[styles.bodyText, { color: themeColors.textDim }]}>
              {fallbackUser.availability}
            </Text>
          </ProfileSection>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

function ProfileSection({
  title,
  children,
  color,
  borderColor,
}: {
  title: string;
  children: React.ReactNode;
  color: string;
  borderColor: string;
}): JSX.Element {
  return (
    <View style={[styles.section, { borderBottomColor: borderColor }]}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: { fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  bodyText: { fontSize: 15, lineHeight: 22 },
  infoText: { fontSize: 15, marginBottom: 6 },
  tags: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  tag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontWeight: "500" },
});
