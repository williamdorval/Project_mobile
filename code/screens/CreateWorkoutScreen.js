import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  getAllExercices,
  createWorkout,
  getWorkoutById,
  getWorkoutDetail,
  updateWorkout,
} from "../services/martha";

export default function CreateWorkoutScreen({ navigation, route }) {
  const theme = useTheme();
  const { user } = useAuth();

  const workoutId = route?.params?.workoutId ?? null;
  const isEdit = !!workoutId;

  const [loading, setLoading] = useState(true);
  const [exercices, setExercices] = useState([]);
  const [search, setSearch] = useState(""); // 🔍 RECHERCHE
  const [selected, setSelected] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  async function load() {
    try {
      // 1️⃣ Charger tous les exercices (pour la liste)
      const allExos = await getAllExercices();
      setExercices(allExos);

      // 2️⃣ MODE EDIT
      if (isEdit) {
        const workout = await getWorkoutById(workoutId);
        const workoutExos = await getWorkoutDetail(workoutId);

        setName(workout.nom);
        setDescription(workout.description ?? "");

        // 🔥 Marquer les exercices sélectionnés
        const sel = {};
        workoutExos.forEach((ex) => {
          sel[ex.exercice_id] = true;
        });
        setSelected(sel);
      }

    } catch (e) {
      console.error("Erreur load CreateWorkoutScreen:", e);
      setError("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);


  // 🔍 FILTRAGE DES EXERCICES
  const filteredExercices = exercices.filter((ex) => {
    const q = search.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.groupe_musculaire.toLowerCase().includes(q)
    );
  });

  function toggleExercice(ex) {
    const countSelected = Object.values(selected).filter(Boolean).length;
    if (!selected[ex.id] && countSelected >= 15) return;

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

      if (isEdit) {
        await updateWorkout(workoutId, name.trim(), description.trim(), exData);
      } else {
        await createWorkout(user.id, name.trim(), description.trim(), exData);
      }

      navigation.goBack();
    } catch (e) {
      console.error(e);
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={theme?.colors?.accent ?? "#007AFF"}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* 🔹 HEADER FIXE */}
      <View style={{ padding: 20 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isEdit ? "Modifier l'entraînement" : "Créer un entraînement"}
        </Text>

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        <TextInput
          placeholder="Nom de l'entraînement"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: theme.colors.card }]}
        />

        <TextInput
          placeholder="Description (optionnel)"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { backgroundColor: theme.colors.card }]}
        />

        {/* 🔍 RECHERCHE */}
        <TextInput
          placeholder="🔍 Rechercher un exercice"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.colors.muted}
          style={[styles.input, { backgroundColor: theme.colors.card }]}
        />

        <Text style={{ color: theme.colors.muted }}>
          {filteredExercices.length} exercice(s)
        </Text>
      </View>

      {/* 🔽 LISTE SCROLLABLE */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {filteredExercices.map((ex) => {
          const isSelected = !!selected[ex.id];
          return (
            <TouchableOpacity
              key={ex.id}
              style={[
                styles.exerciceItem,
                {
                  backgroundColor: isSelected
                    ? theme.colors.accent
                    : theme.colors.card,
                },
              ]}
              onPress={() => toggleExercice(ex)}
            >
              <Text style={{ color: isSelected ? "#fff" : theme.colors.text }}>
                {ex.name}
              </Text>
              <Text style={{ color: isSelected ? "#fff" : theme.colors.muted }}>
                {ex.groupe_musculaire}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 🔒 FOOTER FIXE */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.accent },
          ]}
          onPress={saveWorkout}
          disabled={saving}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {saving
              ? "Enregistrement..."
              : isEdit
              ? "Modifier l'entraînement"
              : "Créer l'entraînement"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  input: { padding: 12, borderRadius: 10, marginBottom: 10 },
  exerciceItem: { padding: 12, borderRadius: 10, marginBottom: 8 },
  footer: { padding: 20 },
  saveButton: { padding: 15, borderRadius: 12, alignItems: "center" },
});
