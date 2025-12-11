import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

export function useBiometricAuth() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricSupported(compatible && enrolled);
    })();
  }, []);

  const authenticate = async (): Promise<boolean> => {
    if (!isBiometricSupported) return false;

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to confirm transfer',
        fallbackLabel: 'Use PIN',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return false;
    }
  };

  return { isBiometricSupported, authenticate };
}
