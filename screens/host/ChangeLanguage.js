import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Ionicons
import COLORS from "../../constants/colors";

const languages = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "zh", label: "中文" },
  { id: "hi", label: "हिन्दी" },
];

export default function ChangeLanguage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (id) => {
    setSelectedLanguage(id);
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={languages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => handleLanguageChange(item.id)}
          >
            <Text
              style={[
                styles.languageText,
                selectedLanguage === item.id && styles.selectedText,
              ]}
            >
              {item.label}
            </Text>
            {selectedLanguage === item.id && (
              <Icon name="checkmark" size={24} color="#007BFF" /> // Check icon
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between", // Align text and icon on opposite ends
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  languageText: { fontSize: 18 },
  selectedText: { fontWeight: "bold", color: "#007BFF" },
  saveButton: {
    backgroundColor:COLORS.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});