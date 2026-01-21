import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { View, Text, SafeAreaView, StyleSheet, TextInput } from "react-native";
import ConversationList from "./ConversationList";
import { useColorScheme } from "@/components/useColorScheme";
import { Search, MoreVertical } from "lucide-react-native";

export default function Messages() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Messages</Text>
        {/* <View style={styles.headerIcons}>
            <MoreVertical size={22} color={themeColors.text} />
        </View> */}
      </View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
        <Search size={18} color={themeColors.textMuted} style={styles.searchIcon} />
        <TextInput
            placeholder="Search"
            placeholderTextColor={themeColors.textMuted}
            style={[styles.searchInput, { color: themeColors.text }]}
            value={search}
            onChangeText={setSearch}
        />
      </View>

      <ConversationList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
