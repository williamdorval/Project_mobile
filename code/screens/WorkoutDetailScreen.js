import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import {
  getWorkoutById,
  getWorkoutDetail,
  marthaPostSimple
} from "../services/martha";

export default function WorkoutDetailScreen({navigate}) {
  const route = useRoute();
  const navigation = useNavigation(); 
  const theme = useTheme();
  const { user } = useAuth();

  const workoutId = route?.params?.workoutId ?? null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [exercices, setExercices] = useState([]);
  const [results, setResults] = useState({}); // poids + reps

  function updateField(exId, field, value) {
    setResults((prev) => ({
      ...prev,
      [exId]: { ...(prev[exId] || {}), [field]: value }
    }));
  }

  async function loadData() {
    try {
      const w = await getWorkoutById(workoutId);
      const ex = await getWorkoutDetail(workoutId);

      console.log("WORKOUT DETAIL FROM MARTHA:", ex);

      setWorkout(w);
      setExercices(ex);
    } catch (err) {
      console.error("Erreur chargement workout :", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (workoutId) loadData();
  }, [workoutId]);

  async function saveWorkout() {
    setSaving(true);

    let hasValidEntry = false;

    for (const ex of exercices) {
      const r = results[ex.exercice_id];
      if (!r) continue;

      const poids = Number(r.weight);
      const reps = Number(r.reps);

      if (poids > 0 && reps > 0) {
        hasValidEntry = true;

        await marthaPostSimple("insert-statistique", {
          user_id: user.id,
          exercice_id: ex.exercice_id,
          poids,
          reps
        });
      }
    }

    if (hasValidEntry) {
      await marthaPostSimple("end-workout", { id: workoutId });

      Alert.alert(
        "🔥 Succès",
        "Entraînement enregistré !",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
              
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("⚠️ Attention", "Aucune donnée enregistrée.");
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.colors.text }}>
          ❌ Entraînement introuvable
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* 🔥 HEADER */}
        <View style={styles.headerBox}>
          <Text style={[styles.workoutTitle, { color: theme.colors.text }]}>
            {workout.nom}
          </Text>

          {workout.description ? (
            <Text
              style={[
                styles.workoutDesc,
                { color: theme.colors.muted }
              ]}
            >
              {workout.description}
            </Text>
          ) : null}
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.accent }]}>
          Exercices :
        </Text>

        {exercices.length === 0 && (
          <Text style={{ color: theme.colors.muted }}>
            Aucun exercice pour cet entraînement.
          </Text>
        )}

        {exercices.map((ex) => {
          const exerciseName =
            ex.nom ||
            ex.name ||
            ex.exercice_name ||
            ex.exercise_name ||
            ex.titre ||
            "Exercice inconnu";

          return (
            <View
              key={ex.id}
              style={[styles.card, { backgroundColor: theme.colors.card }]}
            >
              <Text
                style={[
                  styles.exerciseName,
                  { color: theme.colors.text }
                ]}
              >
                {exerciseName}
              </Text>

              <Text style={{ color: theme.colors.muted, marginBottom: 10 }}>
                {ex.sets} séries × {ex.reps} reps (prévu)
              </Text>

              <View style={styles.row}>
                <TextInput
                  placeholder="Poids (lbs)"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.muted}
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.muted
                    }
                  ]}
                  onChangeText={(v) =>
                    updateField(ex.exercice_id, "weight", v)
                  }
                />

                <TextInput
                  placeholder="Reps"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.muted}
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.muted
                    }
                  ]}
                  onChangeText={(v) =>
                    updateField(ex.exercice_id, "reps", v)
                  }
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.colors.accent }]}
          onPress={saveWorkout}
          disabled={saving}
        >
          <Text style={styles.saveText}>
            {saving ? "Enregistrement..." : "Enregistrer l’entraînement"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* 🔥 STYLES 🔥 */
const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerBox: {
    marginBottom: 25,
    alignItems: "center",
    paddingVertical: 10
  },

  workoutTitle: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 6,
    textTransform: "capitalize"
  },

  workoutDesc: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
    maxWidth: "90%"
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10
  },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 15
  },

  exerciseName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6
  },

  row: {
    flexDirection: "row",
    gap: 10
  },

  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10
  },

  saveBtn: {
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 40
  },

  saveText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});
