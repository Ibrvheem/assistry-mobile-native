
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { XCircle } from "lucide-react-native";

interface ErrorToastProps {
  error: any;
  visible: boolean;
  onDismiss: () => void;
}

export const ErrorToast = ({ error, visible, onDismiss }: ErrorToastProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsRendered(true); // Ensure it's mounted
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
         onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(({ finished }) => {
          if (finished) {
              setIsRendered(false); // Unmount after animation finishes
          }
      });
    }
  }, [visible]);

  if (!isRendered) return null;

  return (
    <Animated.View 
      style={[styles.errorToast, { opacity: fadeAnim }]}
      pointerEvents={visible ? 'auto' : 'none'} // Defensive: ignore touches while fading out
    >
      <XCircle color="#FF6B6B" size={24} />
      <View style={styles.errorContent}>
        <Text style={styles.errorTitle}>Error Occurred</Text>
        <Text style={styles.errorMessage}>
          {error?.message || error?.toString() || "An unexpected error occurred."}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorToast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "#2D1A1A",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  errorMessage: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  dismissText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    marginLeft: 8,
  },
});
