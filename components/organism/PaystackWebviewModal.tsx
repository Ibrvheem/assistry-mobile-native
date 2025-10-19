
import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

import * as Linking from "expo-linking";

export default function PaystackWebviewModal({
  visible,
  onClose,
  authorizationUrl,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  authorizationUrl: string | null;
  onSuccess?: (reference: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const webviewRef = useRef<WebView>(null);

  if (!authorizationUrl) return null;

  const injectedScript = `
    (function() {
      // Capture Paystack window.close() and send a message back to React Native
      const originalClose = window.close;
      window.close = function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'close' }));
        originalClose && originalClose();
      };

      // Monitor Paystack button clicks
      document.addEventListener('click', function(e) {
        if (e.target && e.target.innerText && e.target.innerText.toLowerCase().includes('cancel')) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'cancel' }));
        }
      });
    })();
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.event === "close" || data.event === "cancel") {
        onClose();
      }
    } catch {
      // ignore invalid JSON
    }
  };

  const onNavChange = (navState: any) => {
    const url = navState.url || "";
    const parsed = Linking.parse(url);
    const q = parsed.queryParams || {};

    if (url.includes("success") || q.reference) {
      if (q.reference && onSuccess) onSuccess(String(q.reference));
      onClose();
    }

    if (url.includes("cancel") || url.includes("close")) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Image
            source={require("../../assets/logos/image.png")}
            style={{ width: 48, height: 48, borderRadius: 15 }}
            resizeMode="contain"
          />
        </Pressable>

        <WebView
          ref={webviewRef}
          source={{ uri: authorizationUrl }}
          onNavigationStateChange={onNavChange}
          onMessage={onMessage}
          injectedJavaScript={injectedScript}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          javaScriptEnabled
          originWhitelist={["*"]}
          onShouldStartLoadWithRequest={() => true}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    padding: 6,
    margin: 15,
    borderRadius: 20,
    marginTop: 60,
  },
});
