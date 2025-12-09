import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserWorkouts } from "../services/martha";

export default function EntrainementScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();

  const isFocused = useIsFocused(); // 🔥 quand tu reviens sur l’écran
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);

  async function loadWorkouts() {
    if (!user) return;

    setLoading(true);

    const data = await getUserWorkouts(user.id);
    setWorkouts(data);

    setLoading(false);
  }

  useEffect(() => {
    if (isFocused) {
      loadWorkouts(); // 🔥 se relance chaque fois que tu retournes sur l’écran
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Mes Entraînements</Text>

      {/* BOUTON CRÉER UN ENTRAÎNEMENT */}
      <TouchableOpacity
        style={[styles.createBtn, { backgroundColor: theme.colors.accent }]}
        onPress={() => navigation.navigate("CreateWorkout")}
      >
        <Text style={styles.createBtnText}>➕ Créer un entraînement</Text>
      </TouchableOpacity>

      {workouts.length === 0 && (
        <Text style={{ color: theme.colors.muted, marginTop: 10 }}>
          Aucun entraînement pour le moment.
        </Text>
      )}

      {workouts.map((w) => (
        <TouchableOpacity
          key={w.id}
          style={[styles.card, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate("WorkoutDetail", { workoutId: w.id })}
        >
          <Text style={[styles.name, { color: theme.colors.text }]}>{w.nom}</Text>
          <Text style={{ color: theme.colors.muted }}>{w.description}</Text>

          {w.ended_at && (
            <Text style={{ color: theme.colors.accent }}>
              ✔ Terminé le : {w.ended_at}
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  createBtn: { padding: 15, borderRadius: 12, marginBottom: 20 },
  createBtnText: { color: "white", fontSize: 18, textAlign: "center", fontWeight: "bold" },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },
});