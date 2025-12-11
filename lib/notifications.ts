import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// 1. Configure Notification Handler (Foreground Behavior)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 2. Register for Push Notifications
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    // Get the token (Expo Push Token or FCM Token)
    // For Expo Push Notification service:
    try {
        const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            throw new Error('Project ID not found');
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log("Expo Push Token:", token);
    } catch (e) {
        console.error("Error fetching push token", e);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

// 3. Listeners Hook
export function useNotificationObserver() {
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        // Foreground Listener
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification Received (Foreground):", notification);
            // You can dispatch to store or show custom toast here
        });

        // Background/Response Listener (Deep Linking)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Notification Response:", response);
            const data = response.notification.request.content.data;
            
            // Example Deep Link Logic
            if (data?.url) {
                router.push(data.url as any);
            } else if (data?.roomId) {
                router.push(`/(dashboard)/messages/${data.roomId}` as any);
            }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);
}
