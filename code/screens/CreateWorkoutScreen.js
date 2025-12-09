// screens/CreateWorkoutScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getAllExercices, createWorkout } from "../services/martha";

export default function CreateWorkoutScreen({ navigation }) {
  const theme = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [exercices, setExercices] = useState([]);
  const [selected, setSelected] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllExercices();
        setExercices(data);
      } catch (e) {
        console.error("Erreur getAllExercices", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Créer un entraînement</Text>
        <Text style={{ color: theme.colors.text }}>
          Veuillez vous connecter pour créer un entraînement.
        </Text>
      </View>
    );
  }

  function toggleExercice(ex) {
    const countSelected = Object.values(selected).filter(Boolean).length;
    if (!selected[ex.id] && countSelected >= 15) return; // max 15 exos

    setSelected((prev) => ({
      ...prev,
      [ex.id]: !prev[ex.id],
    }));
  }

  async function saveWorkout() {
    try {
      setError("");
      setSaving(true);

      const selectedIds = Object.entries(selected)
        .filter(([_, v]) => v)
        .map(([id]) => parseInt(id, 10));

      if (!name.trim()) {
        setError("Donne un nom à ton entraînement.");
        setSaving(false);
        return;
      }

      if (selectedIds.length === 0) {
        setError("Choisis au moins un exercice.");
        setSaving(false);
        return;
      }

      const exData = selectedIds.map((id) => ({
        id,
        sets: 3,
        reps: 10,
      }));

      await createWorkout(user.id, name.trim(), description.trim(), exData);

      navigation.goBack();
    } catch (e) {
      console.error("Erreur createWorkout", e);
      setError("Erreur lors de la création de l'entraînement.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Créer un entraînement</Text>

      {error ? <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text> : null}

      <TextInput
        placeholder="Nom de l'entraînement"
        placeholderTextColor={theme.colors.muted}
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Description (optionnel)"
        placeholderTextColor={theme.colors.muted}
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
        Choisis jusqu'à 15 exercices :
      </Text>

      {exercices.map((ex) => {
        const isSelected = !!selected[ex.id];
        return (
          <TouchableOpacity
            key={ex.id}
            style={[
              styles.exerciceItem,
              { backgroundColor: isSelected ? theme.colors.accent : theme.colors.card },
            ]}
            onPress={() => toggleExercice(ex)}
          >
            <Text style={{ color: isSelected ? "#fff" : theme.colors.text, fontWeight: "bold" }}>
              {ex.name}
            </Text>
            <Text style={{ color: isSelected ? "#fff" : theme.colors.muted }}>
              {ex.groupe_musculaire}
            </Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
        onPress={saveWorkout}
        disabled={saving}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {saving ? "Enregistrement..." : "Enregistrer l'entraînement"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 15 },
  input: { padding: 12, borderRadius: 10, marginBottom: 10 },
  exerciceItem: { padding: 12, borderRadius: 10, marginBottom: 8 },
  saveButton: { marginTop: 20, padding: 15, borderRadius: 12 },
});