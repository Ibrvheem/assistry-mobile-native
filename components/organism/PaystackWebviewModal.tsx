// // app/components/organism/PaystackWebviewModal.tsx
// import React, { useState } from "react";
// import { Modal, View, ActivityIndicator } from "react-native";
// import { WebView } from "react-native-webview";
// import * as Linking from "expo-linking";

// export default function PaystackWebviewModal({
//   visible,
//   onClose,
//   authorizationUrl,
// //   onReferenceFound,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   authorizationUrl: string | null;
// //   onReferenceFound: (reference: string) => void;
// }) {
//   const [loading, setLoading] = useState(true);

//   if (!authorizationUrl) return null;

//   function onNavStateChange(navState: any) {
//     const url = navState.url || "";
//     const parsed = Linking.parse(url);
//     const q = parsed.queryParams || {};
//     // if (q.reference) {
//     //   onReferenceFound(String(q.reference));
//     // }
//   }

//   return (
//     <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
//       <View style={{ flex: 1 }}>
//         {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
//         <WebView
//           source={{ uri: authorizationUrl }}
//           onNavigationStateChange={onNavStateChange}
//           onLoadEnd={() => setLoading(false)}
//           startInLoadingState
//           javaScriptEnabled
//           originWhitelist={["*"]}
//         />
//       </View>
//     </Modal>
//   );
// }


// app/components/organism/PaystackWebviewModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Pressable,
  Text,
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
  onSuccess?: (reference: string) => void; // optional callback for tx ref
}) {
  const [loading, setLoading] = useState(true);

  if (!authorizationUrl) return null;

  function onNavStateChange(navState: any) {
    console.log("WebView:", navState);
    console.log("WebView URL:", navState.url);
    console.log("Title:", navState.title);
    console.log("Loading:", navState.loading);

    const url = navState.url || "";
    const parsed = Linking.parse(url);
    const q = parsed.queryParams || {};
    console.log(url);
    console.log(q);

    // Example: if Paystack redirects to your success page
    if (url.includes("success") || q.reference) {
      if (q.reference && onSuccess) {
        onSuccess(String(q.reference));
      }
      onClose(); // close modal automatically after payment success
    }

    // If cancelled (Paystack can redirect to /cancel or /close)
    if (url.includes("cancel") || url.includes("close")) {
      onClose();
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Image
                        source={require("../../assets/logos/image.png")}
                        style={{ width: 48, height: 48, borderRadius:15 }} // tweak size
                        
                        resizeMode="contain"
                      />
        </Pressable> 
                      

        {/* Webview */}
        <WebView
          source={{ uri: authorizationUrl }}
          onNavigationStateChange={onNavStateChange}
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
    margin:15,
    borderRadius: 20,
    marginTop: 60,
    // borderRadius: 18,
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: 'center'
  },
});
