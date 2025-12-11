import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import ConversationList from "./ConversationList";

export default function Messages() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ConversationList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C332B",
    marginBottom: 10,
  },
});
