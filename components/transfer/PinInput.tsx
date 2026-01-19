import React, { useState, useEffect } from 'react';
import Colors from "@/constants/Colors";
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

interface Props {
  length?: number;
  onComplete: (pin: string) => void;
}

export default function PinInput({ length = 4, onComplete }: Props) {
  const [pin, setPin] = useState('');

  const handlePress = (num: string) => {
    if (pin.length < length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === length) {
        onComplete(newPin);
      }
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      {/* Display Dots */}
      <View style={styles.dotsContainer}>
        {Array(length).fill(0).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < pin.length && styles.dotFilled,
            ]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Pressable key={num} style={styles.key} onPress={() => handlePress(String(num))}>
            <Text style={styles.keyText}>{num}</Text>
          </Pressable>
        ))}
        <View style={styles.key} />
        <Pressable style={styles.key} onPress={() => handlePress('0')}>
          <Text style={styles.keyText}>0</Text>
        </Pressable>
        <Pressable style={styles.key} onPress={handleDelete}>
          <Text style={styles.keyText}>⌫</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', width: '100%' },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.brand.text,
  },
  dotFilled: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    gap: 20,
  },
  key: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: Colors.brand.surface,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.brand.text,
  },
});
