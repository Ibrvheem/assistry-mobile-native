import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";

// Mock user data - replace with real data from your backend
const mockUser = {
  name: "John Smith",
  email: "john.smith@university.edu",
  profileImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  department: "Computer Science",
  year: "Senior",
  bio: "Computer Science student passionate about helping fellow students. Experienced in tutoring and technical assistance.",
  skills: ["Programming", "Math", "Physics", "Technical Writing"],
  languages: ["English", "Spanish"],
  availability: "Weekdays after 3 PM",
};

export default function EditProfileScreen() {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [department, setDepartment] = useState(mockUser.department);
  const [year, setYear] = useState(mockUser.year);
  const [bio, setBio] = useState(mockUser.bio);
  const [availability, setAvailability] = useState(mockUser.availability);
  const [skills, setSkills] = useState(mockUser.skills);
  const [languages, setLanguages] = useState(mockUser.languages);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user profile logic here

      router.back();
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter((language) => language !== languageToRemove));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text
            style={[
              styles.saveButtonText,
              isSaving && styles.saveButtonTextDisabled,
            ]}
          >
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView}>
        <Animated.View entering={FadeIn.duration(300)}>
          <View style={styles.imageSection}>
            <Image
              source={{ uri: mockUser.profileImage }}
              style={styles.profileImage}
              contentFit="cover"
              transition={200}
            />
            <Pressable style={styles.changePhotoButton}>
              <Ionicons name="camera" size={20} color="#22C55E" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="Your department"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Your year"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Skills</Text>
            <View style={styles.tags}>
              {skills.map((skill, index) => (
                <Pressable
                  key={index}
                  style={styles.tag}
                  onPress={() => removeSkill(skill)}
                >
                  <Text style={styles.tagText}>{skill}</Text>
                  <Ionicons name="close-circle" size={16} color="#22C55E" />
                </Pressable>
              ))}
            </View>
            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.addItemInput}
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Add a skill"
                onSubmitEditing={addSkill}
              />
              <Pressable style={styles.addItemButton} onPress={addSkill}>
                <Ionicons name="add" size={24} color="#22C55E" />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Languages</Text>
            <View style={styles.tags}>
              {languages.map((language, index) => (
                <Pressable
                  key={index}
                  style={styles.tag}
                  onPress={() => removeLanguage(language)}
                >
                  <Text style={styles.tagText}>{language}</Text>
                  <Ionicons name="close-circle" size={16} color="#22C55E" />
                </Pressable>
              ))}
            </View>
            <View style={styles.addItemContainer}>
              <TextInput
                style={styles.addItemInput}
                value={newLanguage}
                onChangeText={setNewLanguage}
                placeholder="Add a language"
                onSubmitEditing={addLanguage}
              />
              <Pressable style={styles.addItemButton} onPress={addLanguage}>
                <Ionicons name="add" size={24} color="#22C55E" />
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Availability</Text>
            <TextInput
              style={styles.input}
              value={availability}
              onChangeText={setAvailability}
              placeholder="When are you available?"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: "center",
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    marginLeft: 8,
    color: "#22C55E",
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  tagText: {
    color: "#22C55E",
    marginRight: 4,
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addItemInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#000",
    marginRight: 8,
  },
  addItemButton: {
    backgroundColor: "#f0fdf4",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
});
