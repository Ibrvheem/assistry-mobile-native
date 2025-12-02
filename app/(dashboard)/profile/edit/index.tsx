import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "../../../avatar";
import { uploadImage, updateUser, getMe } from "../services";
import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
// // import { Avatar } from "@/components/avatar";
// import { useFocusEffect } from "@react-navigation/native";
// import  {  useCallback } from "react";

const mockUser = {
  name: "John Smith",
  email: "john.smith@university.edu",
  profileImage:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
  department: "Computer Science",
  year: "Senior",
  bio: "Computer Science student passionate about helping fellow students. Experienced in tutoring and technical assistance.",
  skills: ["Programming", "Math", "Physics", "Technical Writing"],
  languages: ["English", "Hausa", "Yoruba"],
  availability: "Weekdays after 3 PM",
};

export default function EditProfileScreen(): JSX.Element {
  const [image, setImage] = useState<string | null>(null);
  const [first_name, setFirstName] = useState(mockUser.name);
  const [last_name, setLastName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(mockUser.department);
  const [year, setYear] = useState(mockUser.year);
  const [bio, setBio] = useState(mockUser.bio);
  const [availability, setAvailability] = useState(mockUser.availability);
  const [skills, setSkills] = useState<string[]>(mockUser.skills);
  const [languages, setLanguages] = useState<string[]>(mockUser.languages);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { saveUserData, refreshUser } = useGobalStoreContext();

  
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return getMe();
    },
  });

    useEffect(() => {
  if (user) {
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setEmail(user.email || '');
    setPhone(user.phone_no || '');
    setDepartment(user.department || '');
    setYear(user.level || '');
    setBio(user.bio || '');
  }
}, [user]);

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // const handleSave = async (): Promise<void> => {
  //   try {
  //     setIsSaving(true);
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     router.back();
  //   } catch (error) {
  //     console.error("Failed to save profile:", error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  // Inside 
  



const handleSave = async (): Promise<void> => {
  try {
    setIsSaving(true);

    let uploadedImageKey = null;
    let uploadedImageURL= null;
    // let uploaded_image: { kind: string | null; assetStorageKey: string } = ;
    if (image) {
      const uploadResult = await uploadImage(image);
      uploadedImageKey = uploadResult.assetStorageKey;
      uploadedImageURL = uploadResult.url;
    }



    const payload = {
  first_name,
  last_name,
  ...(image && { profile_picture: uploadedImageURL }),
  email,
  phone_no: phone,
  department,
  level: year,
  bio,
};

    
    // 🔹 Update profile
    await updateUser(payload);

    // 🔹 Fetch latest user data from backend
    const me = await getMe();

    // // console.log("Updated User Data Level:", me);

    // 🔹 Save and refresh global store
    await saveUserData(me);
    await refreshUser();

    router.back();
  } catch (error) {
    console.error("Failed to save profile:", error);
  } finally {
    setIsSaving(false);
  }
};

  const addSkill = (): void => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string): void => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const addLanguage = (): void => {
    const trimmed = newLanguage.trim();
    if (trimmed && !languages.includes(trimmed)) {
      setLanguages([...languages, trimmed]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string): void => {
    setLanguages(languages.filter((l) => l !== lang));
  };



  // // console.log("User Edit Data:", user);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ marginTop: 12, color: "#555" }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }



 
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
            {image || user.profile_picture ? (
              <Image
                source={{
    uri: image
      ? image
      : user?.profile_picture?.startsWith('http')
      ? user.profile_picture
      : `https://res.cloudinary.com/<your-cloud-name>/image/upload/${user.profile_picture}`,
  }}
                style={styles.profileImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Avatar size={100} />
            )}
            <Pressable style={styles.changePhotoButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#22C55E" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          <View style={styles.nameSection}>

          <View style={styles.n_section}>
            {/* <Text style={styles.label}>Name</Text> */}
            <TextInput
              style={styles.input}
              value={first_name}
              onChangeText={setFirstName}
              placeholder="Your name"
            />
          </View>
          <View style={styles.n_section}>
            {/* <Text style={styles.label}>Name</Text> */}
            <TextInput
              style={styles.input}
              value={last_name}
              onChangeText={setLastName}
              placeholder="Your name"
            />
          </View>
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
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Your phone number"
              keyboardType="phone-pad"
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
            <Text style={styles.label}>Level</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="Your level"
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
            />
          </View>

          {/* <View style={styles.section}>
            <Text style={styles.label}>Skills</Text>
            <View style={styles.tags}>
              {skills.map((skill) => (
                <Pressable
                  key={skill}
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
          </View> */}

          <View style={styles.section}>
            <Text style={styles.label}>Languages</Text>
            <View style={styles.tags}>
              {languages.map((lang) => (
                <Pressable
                  key={lang}
                  style={styles.tag}
                  onPress={() => removeLanguage(lang)}
                >
                  <Text style={styles.tagText}>{lang}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  saveButton: {
    backgroundColor: "#14342b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nameSection: {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
},
  saveButtonDisabled: { backgroundColor: "#ccc" },
  saveButtonText: { color: "#fff", fontWeight: "600" },
  saveButtonTextDisabled: { color: "#fff" },
  scrollView: { flex: 1 },
  imageSection: { alignItems: "center", padding: 24 },
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
  changePhotoText: { marginLeft: 8, color: "#22C55E", fontWeight: "600" },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  n_section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width: "50%",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 8 },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  tags: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
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
  tagText: { color: "#22C55E", marginRight: 4 },
  addItemContainer: { flexDirection: "row", alignItems: "center" },
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
