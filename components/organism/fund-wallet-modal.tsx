// app/components/organism/fund-wallet-modal.tsx
import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button, YStack, Sheet } from "tamagui";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import LoadingChildren from "@/components/molecules/loading-children";
import { useFund } from "@/app/hooks/useFund";
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
    <View>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[30]}
        dismissOnSnapToBottom
      >
        <Sheet.Frame style={styles.frame}>
          <YStack space>
            <ScrollView style={{ minHeight: "100%", backgroundColor: "white" }}>
              <KeyboardAwareScrollView>
                <View style={styles.inner}>
                  {error && (
                    <Text style={styles.errorBox}>{String(error)}</Text>
                  )}

                  <Button style={styles.closeButton2} onPress={() => setOpen(false)}>
                    <Text
                    style={styles.closeButtontext} >Close</Text>
                  </Button>

                  <FormProvider {...methods}>
                    <View style={styles.row}>
                      <View style={{ width: "77%" }}>
                        <ControlledInput
                          name="amount"
                          label="Amount"
                          placeholder="1000"
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={{ width: "20%" }}>
                        <Button
                          style={styles.fundBtn}
                          onPress={() => {
                            onSubmit();
                          }}
                        >
                          <LoadingChildren loading={loading}>Fund</LoadingChildren>
                        </Button>

                        <PaystackWebviewModal
                          visible={payVisible}
                          onClose={() => setPayVisible(false)}
                          authorizationUrl={payUrl}
                        //   onReferenceFound={(reference) => {
                        //     handleVerify(reference);
                        //   }}
                        />
                      </View>
                    </View>
                  </FormProvider>

                  <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    padding: 16,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  inner: {
    backgroundColor: "white",
    height: "100%",
    padding: 16,
  },
  errorBox: {
    fontSize: 14,
    color: "#D5A247",
    backgroundColor: "#EEDD97",
    padding: 8,
    borderRadius: 5,
  },
  closeButton2: {
    position: "absolute",
    width: "auto",
    height: 16,
    top: 3,
    right: 10,
    borderRadius: 18,
    backgroundColor: "#DBCBCC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    zIndex: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  fundBtn: {
    height: 56,
    backgroundColor: "#22c55e",
    width: "100%",
    marginTop: 50,
  },
  closeButtontext:{
    fontSize: 10,
  }
});
