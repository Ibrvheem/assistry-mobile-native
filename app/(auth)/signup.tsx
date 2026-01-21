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
import { useColorScheme } from '@/components/useColorScheme';

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  
  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedItem = items.find(item => item.value === value);

  return (
    <View style={[styles.inputContainer, { zIndex: isOpen ? 1000 : 1 }]}>
      <Text style={[styles.label, { color: themeColors.textDim }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.pickerButton, 
          { 
             backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
             borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          },
          error && styles.inputError,
          isOpen && { borderColor: themeColors.primary, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
        ]} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={[styles.pickerButtonText, { color: themeColors.text }, !value && { color: themeColors.textMuted }]}>
          {selectedItem ? selectedItem.label : placeholder || "Select"}
        </Text>
        <ChevronDown 
          size={20} 
          color={themeColors.textMuted} 
          style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownContainer, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
          {searchable && (
            <View style={[styles.searchContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', margin: 8 }]}>
              <Search size={18} color={themeColors.textMuted} />
              <TextInput 
                style={[styles.searchInput, { color: themeColors.text, fontSize: 14 }]}
                placeholder="Search..."
                placeholderTextColor={themeColors.textMuted}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>
          )}

          <ScrollView 
            style={{ maxHeight: 200 }}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          >
            {filteredItems.map((item) => (
              <TouchableOpacity 
                key={item.value}
                style={[styles.dropdownItem, { borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} 
                onPress={() => {
                  onSelect(item.value);
                  setIsOpen(false);
                  setSearchText("");
                }}
              >
                <Text style={[styles.dropdownItemText, { color: themeColors.textDim }, item.value === value && { color: themeColors.secondary, fontWeight: 'bold' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const FormInput = ({ control, name, label, placeholder, secureTextEntry, keyboardType, autoCapitalize }: any) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: themeColors.textDim }]}>{label}</Text>
            <TextInput
              style={[styles.input, 
                { 
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0,0,0,0.05)',
                    color: themeColors.text,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                },
                error && styles.inputError
              ]}
              placeholder={placeholder}
              placeholderTextColor={themeColors.textMuted}
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
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

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
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={themeColors.gradient}
        locations={themeColors.gradientLocations as any}
        style={styles.background}
      />
      <ErrorToast visible={showError} error={error?.message || "Signup failed"} onDismiss={() => setShowError(false)} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.contentContainer}>
             <View style={styles.header}>
                 <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
                    <View style={[styles.logoContainer, { backgroundColor: themeColors.primary }]}>
                      <Image 
                      // source={require("@/assets/logos/logo.png")} 
                      source={isDark ? require("@/assets/logos/logo.png") : require("@/assets/logos/image.png")}
                      style={styles.logo} resizeMode="contain" />
                    </View>
                    <Text style={[styles.welcomeText, { color: themeColors.text }]}>Create Account</Text>
                     <Text style={[styles.subtitleText, { color: themeColors.textDim }]}>Join Assistry today</Text>
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

                        <View style={[styles.inputContainer, { zIndex: 60 }]}>
                          <FormInput control={control} name="email" label="Email" placeholder="jamal@example.com" keyboardType="email-address" autoCapitalize="none" />
                        </View>
                        <View style={[styles.inputContainer, { zIndex: 50 }]}>
                          <FormInput control={control} name="username" label="Username" placeholder="jamal_dev" autoCapitalize="none" />
                        </View>
                        <View style={[styles.inputContainer, { zIndex: 40 }]}>
                          <FormInput control={control} name="phone_no" label="Phone Number" placeholder="0810..." keyboardType="phone-pad" />
                        </View>
                        
                        <View style={[styles.inputContainer, { zIndex: 35 }]}>
                          <FormInput control={control} name="password" label="Password" placeholder="Minimum 8 characters" secureTextEntry />
                        </View>
                        
                        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

                        <View style={[styles.inputContainer, { zIndex: 30 }]}>
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
                        </View>

                        <View style={[styles.inputContainer, { zIndex: 25 }]}>
                          <FormInput control={control} name="reg_no" label="Reg No" placeholder="CSC/2021/045" autoCapitalize="none" />
                        </View>
                        <View style={[styles.inputContainer, { zIndex: 20 }]}>
                          <FormInput control={control} name="department" label="Department" placeholder="Computer Science" />
                        </View>
                        
                        <View style={[styles.row, { zIndex: 15 }]}>
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

                        <View style={[styles.inputContainer, { zIndex: 10 }]}>
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
                        </View>

                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: themeColors.primary }]} 
                          onPress={handleSubmit(onSubmit)}
                          disabled={loading}
                        >
                          {loading ? (
                            <ActivityIndicator color={Colors.brand.darkGreen} />
                          ) : (
                            <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>Sign Up</Text>
                          )}
                        </TouchableOpacity>

                        <View style={styles.authSwitchContainer}>
                            <Text style={[styles.authLabel, { color: themeColors.textDim }]}>Have an account? </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
                              <Text style={[styles.authLink, { color: themeColors.primary }]}>Sign In</Text>
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
    // Dynamic BG
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
    // Dynamic BG
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 15
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    // Dynamic Color
  },
  subtitleText: {
    // Dynamic Color
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
      // Dynamic Color
      fontSize: 14,
      marginBottom: 6,
      marginLeft: 4,
      fontWeight: 'bold',
  },
  input: {
    // Dynamic BG & Border
    borderRadius: 12,
    padding: 14,
    // Dynamic Color
    borderWidth: 1,
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
      // Dynamic BG & Border
      borderRadius: 12,
      padding: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
  },
  pickerButtonText: {
      // Dynamic Color
      fontSize: 16,
  },
  placeholderText: {
      // Dynamic Color (Muted)
  },
  actionButton: {
    // Dynamic BG
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    // Dynamic Color
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
      height: 1,
      // Dynamic BG
      marginVertical: 10,
  },
  authSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  authLabel: {
    // Dynamic Color
  },
  authLink: {
    // Dynamic Color
    fontWeight: 'bold',
  },
  // Dropdown Styles
  dropdownContainer: {
    position: 'absolute',
    top: 82, // Button height + label height + spacing
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 2000,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
  },
});
