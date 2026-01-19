import React, { useState, useEffect, useRef } from 'react';
import Colors from '@/constants/Colors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, Animated, Easing, Image, ScrollView, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorToast } from '@/components/ErrorToast';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { signupStudentSchema, SignupStudentPayload } from './types';
import { useSignupStudent } from './hooks/useSignupStudent';
import { useInstitutions } from './hooks/useInstitutions';

const { width, height } = Dimensions.get('window');

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

interface PickerProps {
  label: string;
  items: { label: string; value: string }[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
}

const CustomPicker = ({ label, items, value, onSelect, placeholder, searchable, error }: PickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  
  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.pickerButton, error && styles.inputError]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerButtonText, !value && styles.placeholderText]}>
          {selectedItem ? selectedItem.label : placeholder || "Select"}
        </Text>
        <ChevronDown size={20} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={styles.searchContainer}>
                <Search size={20} color="rgba(255,255,255,0.5)" />
                <TextInput 
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
            )}

            <FlatList 
              data={filteredItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem} 
                  onPress={() => {
                    onSelect(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, item.value === value && styles.selectedItemText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const FormInput = ({ control, name, label, placeholder, secureTextEntry, keyboardType, autoCapitalize }: any) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
             />
             {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default function SignUp() {
  const { signup, loading, error } = useSignupStudent();
  const { data: institutions, isLoading: loadingInstitutions } = useInstitutions();
  
  const [showError, setShowError] = useState(false);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const methods = useForm<SignupStudentPayload>({
    resolver: zodResolver(signupStudentSchema),
    defaultValues: {
      password: "password", // Initial dev default if needed, or remove
    }
  });

  const { control, handleSubmit, setValue, watch, formState: { errors } } = methods;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
      if (error) {
        setShowError(true);
        const timer = setTimeout(() => setShowError(false), 5000);
        return () => clearTimeout(timer);
      }
    }, [error]);

  const onSubmit = (data: SignupStudentPayload) => {
    signup(data);
  };

  const institutionItems = institutions?.map((inst: any) => ({
    label: inst.name,
    value: inst.id || inst._id
  })) || [];

  const stateItems = NIGERIA_STATES.map(s => ({ label: s, value: s }));
  const genderItems = GENDER_OPTIONS.map(g => ({ label: g, value: g }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        style={styles.background}
      />
      <ErrorToast visible={showError} error={error?.message || "Signup failed"} onDismiss={() => setShowError(false)} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>
             <View style={styles.header}>
                 <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
                    <View style={styles.logoContainer}>
                      <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
                    </View>
                    <Text style={styles.welcomeText}>Create Account</Text>
                     <Text style={styles.subtitleText}>Join Assistry today</Text>
                 </Animated.View>
             </View>

             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                 <Animated.View style={[styles.formSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <FormProvider {...methods}>
                        
                        <View style={styles.row}>
                             <View style={styles.halfWidth}>
                                 <FormInput control={control} name="first_name" label="First Name" placeholder="Jamal" />
                             </View>
                             <View style={styles.halfWidth}>
                                 <FormInput control={control} name="last_name" label="Last Name" placeholder="Abdullahi" />
                             </View>
                        </View>

                        <FormInput control={control} name="email" label="Email" placeholder="jamal@example.com" keyboardType="email-address" autoCapitalize="none" />
                        <FormInput control={control} name="phone_no" label="Phone Number" placeholder="0810..." keyboardType="phone-pad" />
                        
                        <FormInput control={control} name="password" label="Password" placeholder="Minimum 8 characters" secureTextEntry />
                        
                        <View style={styles.divider} />

                        <Controller
                          control={control}
                          name="institution"
                          render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <CustomPicker 
                              label="Institution" 
                              items={institutionItems} 
                              value={value} 
                              onSelect={onChange} 
                              placeholder={loadingInstitutions ? "Loading..." : "Select Institution"}
                              searchable
                              error={error?.message}
                            />
                          )}
                        />

                        <FormInput control={control} name="reg_no" label="Reg No" placeholder="CSC/2021/045" autoCapitalize="none" />
                        <FormInput control={control} name="department" label="Department" placeholder="Computer Science" />
                        
                        <View style={styles.row}>
                            <View style={styles.halfWidth}>
                                <FormInput control={control} name="level" label="Level" placeholder="400" keyboardType="numeric" />
                            </View>
                             <View style={styles.halfWidth}>
                                 <Controller
                                  control={control}
                                  name="gender"
                                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <CustomPicker 
                                      label="Gender" 
                                      items={genderItems} 
                                      value={value} 
                                      onSelect={onChange} 
                                      placeholder="Select"
                                      error={error?.message}
                                    />
                                  )}
                                />
                             </View>
                        </View>

                        <Controller
                            control={control}
                            name="state"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                              <CustomPicker 
                                label="State" 
                                items={stateItems} 
                                value={value} 
                                onSelect={onChange} 
                                placeholder="Select State"
                                searchable
                                error={error?.message}
                              />
                            )}
                          />

                        <TouchableOpacity 
                          style={styles.actionButton} 
                          onPress={handleSubmit(onSubmit)}
                          disabled={loading}
                        >
                          {loading ? (
                            <ActivityIndicator color="#1A3E2A" />
                          ) : (
                            <Text style={styles.actionButtonText}>Sign Up</Text>
                          )}
                        </TouchableOpacity>

                        <View style={styles.authSwitchContainer}>
                            <Text style={styles.authLabel}>Have an account? </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
                              <Text style={styles.authLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Extra padding for scroll */}
                        <View style={{ height: 40 }} /> 

                    </FormProvider>
                 </Animated.View>
             </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  background: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  safeArea: { flex: 1 },
  contentContainer: { flex: 1 },
  header: {
     paddingHorizontal: 24,
     marginTop: 40,
     marginBottom: 10,
     alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 4,
  },
  scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 40,
      marginTop: 15,
  },
  formSection: {
      gap: 16,
  },
  inputContainer: {
      marginBottom: 12,
  },
  label: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginBottom: 6,
      marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 16,
  },
  inputError: {
      borderColor: '#FF6B6B',
  },
  errorText: {
      color: '#FF6B6B',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
  },
  row: {
      flexDirection: 'row',
      gap: 12,
  },
  halfWidth: {
      flex: 1,
  },
  pickerButton: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  pickerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
  },
  placeholderText: {
      color: 'rgba(255,255,255,0.4)',
  },
  actionButton: {
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: Colors.brand.darkGreen,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginVertical: 10,
  },
  authSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  authLabel: {
    color: 'rgba(255,255,255,0.6)',
  },
  authLink: {
    color: Colors.brand.primary,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'flex-end',
  },
  modalContent: {
      backgroundColor: '#1A1A1A',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: height * 0.7,
      paddingBottom: 40,
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      margin: 16,
      paddingHorizontal: 12,
      borderRadius: 12,
      height: 48,
  },
  searchInput: {
      flex: 1,
      color: 'white',
      marginLeft: 8,
      height: '100%',
  },
  modalItem: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalItemText: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 16,
  },
  selectedItemText: {
      color: Colors.brand.primary,
      fontWeight: 'bold',
  },
});
