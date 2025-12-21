import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function CompleteProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, updateProfile, deleteAccount } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState(null);
  const [goal, setGoal] = useState(null);


  const [initialProfile, setInitialProfile] = useState(null);

  const GOALS = ["Perte de poids", "Gain de masse", "Gain de muscle", "Autre"];

 
  useEffect(() => {
    if (!user) return;

    const snapshot = {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      weight: user.weight != null ? String(user.weight) : "",
      height: user.height != null ? String(user.height) : "",
      gender: user.gender ?? null,
      goal: user.goal ?? null,
    };

    setInitialProfile(snapshot);

    setFirstName(snapshot.firstName);
    setLastName(snapshot.lastName);
    setWeight(snapshot.weight);
    setHeight(snapshot.height);
    setGender(snapshot.gender);
    setGoal(snapshot.goal);
  }, [user]);

 
  const validateProfile = () => {
    if (!firstName.trim() || firstName.trim().length < 2) {
      Alert.alert("Erreur", "Le prénom doit contenir au moins 2 caractères.");
      return false;
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      Alert.alert("Erreur", "Le nom doit contenir au moins 2 caractères.");
      return false;
    }

    const w = Number(weight);
    if (!weight || isNaN(w) || w < 30 || w > 300) {
      Alert.alert("Erreur", "Le poids doit être entre 30 et 300 kg.");
      return false;
    }

    const h = Number(height);
    if (!height || isNaN(h) || h < 100 || h > 250) {
      Alert.alert("Erreur", "La taille doit être entre 100 et 250 cm.");
      return false;
    }

    if (!gender) {
      Alert.alert("Erreur", "Veuillez sélectionner votre sexe.");
      return false;
    }

    if (!goal) {
      Alert.alert("Erreur", "Veuillez sélectionner un objectif.");
      return false;
    }

    return true;
  };

  
  const hasChanged = useMemo(() => {
    if (!initialProfile) return false;

    return (
      firstName !== initialProfile.firstName ||
      lastName !== initialProfile.lastName ||
      weight !== initialProfile.weight ||
      height !== initialProfile.height ||
      gender !== initialProfile.gender ||
      goal !== initialProfile.goal
    );
  }, [firstName, lastName, weight, height, gender, goal, initialProfile]);

  
  const handleSave = async () => {
    if (!validateProfile()) return;

    if (!hasChanged) {
      Alert.alert("Info", "Aucune modification détectée.");
      return;
    }

    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        weight: Number(weight),
        height: Number(height),
        gender,
        goal,
      });

      Alert.alert("Succès", "Profil mis à jour !");
       navigation.navigate("MainTabs", {
          screen: "Profile"
        });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de sauvegarder le profil.");
    }
  };

 
  const handleCancel = () => {
    if (initialProfile) {
      setFirstName(initialProfile.firstName);
      setLastName(initialProfile.lastName);
      setWeight(initialProfile.weight);
      setHeight(initialProfile.height);
      setGender(initialProfile.gender);
      setGoal(initialProfile.goal);
    }
    navigation.goBack();
  };


  const handleDeleteAccount = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "⚠️ Cette action est irréversible.\n\nSupprimer votre compte ?"
      );
      if (!confirmed) return;

      await deleteAccount();
      navigation.navigate("Profile");
      return;
    }

    Alert.alert(
      "Supprimer le compte",
      "⚠️ Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteAccount();
            navigation.navigate("Profile");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Modifier mon profil
      </Text>

      <TextInput
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Poids (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(t) => setWeight(t.replace(/[^0-9]/g, ""))}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Taille (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(t) => setHeight(t.replace(/[^0-9]/g, ""))}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <Text style={{ color: theme.colors.text }}>Sexe :</Text>
      <View style={styles.row}>
        {["homme", "femme", "autre"].map((g) => (
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

      <Text style={{ color: theme.colors.text }}>Objectif :</Text>
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

      {/* 💾 SAVE */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={!hasChanged}
        style={[
          styles.submitButton,
          {
            backgroundColor: hasChanged ? theme.colors.accent : "#999",
          },
        ]}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Sauvegarder
        </Text>
      </TouchableOpacity>

      {/* ↩️ CANCEL */}
      <TouchableOpacity
        onPress={handleCancel}
        style={[styles.cancelButton, { borderColor: theme.colors.accent }]}
      >
        <Text style={{ color: theme.colors.accent, fontWeight: "bold" }}>
          Annuler
        </Text>
      </TouchableOpacity>

      {/* 🗑️ DELETE */}
      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={[styles.submitButton, { backgroundColor: "#D32F2F", marginTop: 30 }]}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          🗑️ Supprimer mon compte
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { padding: 14, borderRadius: 10, marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 12 },
  choiceButton: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 2,
  },
});
