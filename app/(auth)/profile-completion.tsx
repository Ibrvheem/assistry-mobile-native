
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
// import { useUpdateProfile } from './hooks/useUpdateProfile'; // Assume this hook exists or we create it
import { ArrowLeft, Calendar, Upload, Check } from 'lucide-react-native';

// Categories options
const CATEGORIES = ["Cleaning", "Academic", "Logistics", "Tech Support", "Events", "Other"];

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileCompletion() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); 

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      dob: new Date(),
      id_card_url: '',
      preferred_task_categories: [] as string[],
    }
  });

  const handleSkip = async () => {
      try {
          await AsyncStorage.setItem("skipProfileCompletion", "true");
          router.replace('/(dashboard)');
      } catch (e) {
          console.error("Failed to skip", e);
      }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
    setValue('dob', currentDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
      setValue('id_card_url', result.assets[0].uri); 
    }
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    setValue('preferred_task_categories', newCategories);
  };

  const onSubmit = async (data: any) => {
    console.log("Submitting Profile Data:", data);
    setLoading(true);
    // TODO: Integrate actual API call here
    // await updateProfile(data);
    setTimeout(() => {
        setLoading(false);
        router.replace('/(dashboard)'); 
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Help us verify your identity and preferences</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            
            {/* DOB Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateText}>{date.toDateString()}</Text>
                    <Calendar size={20} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </View>

            {/* ID Upload Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Student ID Card</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    {idImage ? (
                        <Image source={{ uri: idImage }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <Upload size={32} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.uploadText}>Tap to Upload</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
                <Text style={styles.label}>Preferred Task Categories</Text>
                <View style={styles.categoriesContainer}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                selectedCategories.includes(cat) && styles.categoryChipSelected
                            ]}
                            onPress={() => toggleCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategories.includes(cat) && styles.categoryTextSelected
                            ]}>{cat}</Text>
                            {selectedCategories.includes(cat) && <Check size={14} color={Colors.brand.darkGreen} />}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
                <TouchableOpacity style={[styles.submitButton, {flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'}]} onPress={handleSkip}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.submitButton, {flex: 2}]} onPress={handleSubmit(onSubmit)} disabled={loading}>
                    {loading ? <ActivityIndicator color={Colors.brand.darkGreen} /> : <Text style={styles.submitButtonText}>Finish Setup</Text>}
                </TouchableOpacity>
            </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.background },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  safeArea: { flex: 1 },
  header: { padding: 24, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)' },
  content: { padding: 24, gap: 24 },
  section: { gap: 12 },
  label: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  dateButton: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  dateText: { color: 'white', fontSize: 16 },
  uploadButton: {
      height: 180, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed',
      overflow: 'hidden'
  },
  uploadPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  uploadText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryChip: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24,
      backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  categoryChipSelected: { backgroundColor: Colors.brand.primary, borderColor: Colors.brand.primary },
  categoryText: { color: 'white', fontSize: 14 },
  categoryTextSelected: { color: Colors.brand.darkGreen, fontWeight: 'bold' },
  submitButton: {
      backgroundColor: Colors.brand.primary, padding: 18, borderRadius: 16,
      alignItems: 'center', marginTop: 10,
      shadowColor: Colors.brand.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  submitButtonText: { color: Colors.brand.darkGreen, fontSize: 18, fontWeight: 'bold' },
});
