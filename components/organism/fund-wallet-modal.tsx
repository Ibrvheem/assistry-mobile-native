

import React, { Dispatch, SetStateAction } from "react";
import Colors from "@/constants/Colors";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Button } from "tamagui";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import LoadingChildren from "@/components/molecules/loading-children";
import { useFund } from "@/app/hooks/useFund";
import { router } from "expo-router";
import PaystackWebviewModal from "./PaystackWebviewModal";

interface FundModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function FundModal({ open, setOpen }: FundModalProps) {
  const {
    methods,
    onSubmit,
    loading,
    error,
    payVisible,
    setPayVisible,
    payUrl,
  } = useFund({ setOpen });

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={() => setOpen(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // adjust if needed
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* <KeyboardAwareScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              enableOnAndroid
              extraScrollHeight={2}
            > */}
              <View style={styles.inner}>
                {error && <Text style={styles.errorBox}>{String(error)}</Text>}

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton2}
                  onPress={() => setOpen(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <FormProvider {...methods}>
                  <View style={styles.row}>
                    <View style={{ width: "65%" }}>
                      <ControlledInput
                        name="amount"
                        label="Amount"
                        placeholder="1000"
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={{ width: "30%" }}>
                      <Button
                        style={styles.fundBtn}
                        onPress={() => onSubmit()}
                        disabled={loading}
                        opacity={loading ? 0.6 : 1}
                      >
                        <LoadingChildren loading={loading}>Fund</LoadingChildren>
                      </Button>

                      {/* <PaystackWebviewModal
                        visible={payVisible}
                        onClose={() => {
                          setPayVisible(false);
                          setOpen(false);
                          router.push("/(dashboard)");
                        }}
                        authorizationUrl={payUrl}
                      /> */}

                      <PaystackWebviewModal
  visible={payVisible}
  onClose={() => {
    setPayVisible(false);
    setTimeout(() => {
      setOpen(false);
      requestAnimationFrame(() => {
      router.push("/(dashboard)");
    });
      // router.push("/(dashboard)");
    }, 300); // small delay lets modal animation finish
  }}
  authorizationUrl={payUrl}
/>

                    </View>
                  </View>
                </FormProvider>

                <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
              </View>
            {/* </KeyboardAwareScrollView> */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.brand.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    minHeight: "25%",
  },
  inner: {
    // flex: 1,
    backgroundColor: Colors.brand.background,
    padding: 16,
  },
  errorBox: {
    fontSize: 14,
    color: "#D5A247",
    backgroundColor: "#EEDD97",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton2: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 18,
    backgroundColor: "#DBCBCC",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  fundBtn: {
    height: 36,
    backgroundColor: Colors.brand.primary,
    width: "100%",
    marginTop: 35,
  },
});
