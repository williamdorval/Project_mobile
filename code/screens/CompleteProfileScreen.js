import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfileScreen() {
  const theme = useTheme();
  const { updateProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(null);
  const [goal, setGoal] = useState(null);

  const GOALS = [
    "Perte de poids",
    "Gain de masse",
    "Gain de muscle",
    "Autre"
  ];

  const handleContinue = () => {
    updateProfile({
      firstName,
      lastName,
      weight,
      height,
      gender,
      goal,
    });

   
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        Compléter votre profil
      </Text>

      <TextInput
        placeholder="Prénom"
        placeholderTextColor={theme.colors.muted}
        value={firstName}
        onChangeText={setFirstName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Nom"
        placeholderTextColor={theme.colors.muted}
        value={lastName}
        onChangeText={setLastName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Poids (kg)"
        keyboardType="numeric"
        placeholderTextColor={theme.colors.muted}
        value={weight}
        onChangeText={setWeight}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Taille (cm)"
        keyboardType="numeric"
        placeholderTextColor={theme.colors.muted}
        value={height}
        onChangeText={setHeight}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <Text style={{ color: theme.colors.text, marginBottom: 8 }}>Sexe :</Text>
      <View style={styles.row}>
        {["Homme", "Femme", "Autre"].map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGender(g)}
            style={[
              styles.choiceButton,
              { backgroundColor: gender === g ? theme.colors.accent : theme.colors.card },
            ]}
          >
            <Text style={{ color: gender === g ? "#fff" : theme.colors.text }}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: theme.colors.text, marginBottom: 8, marginTop: 10 }}>
        Objectif :
      </Text>
      <View style={styles.row}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setGoal(g)}
            style={[
              styles.choiceButton,
              { backgroundColor: goal === g ? theme.colors.accent : theme.colors.card },
            ]}
          >
            <Text style={{ color: goal === g ? "#fff" : theme.colors.text }}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        style={[styles.submitButton, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Continuer
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  choiceButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
});
