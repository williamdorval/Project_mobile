import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserWorkouts, updateWorkoutStartDate } from "../services/martha";

export default function EntrainementScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAuth();

  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);

  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function loadWorkouts() {
    if (!user) return;
    setLoading(true);
    const data = await getUserWorkouts(user.id);
    setWorkouts(data);
    setLoading(false);
  }

  useEffect(() => {
    if (isFocused) loadWorkouts();
  }, [isFocused]);

  function getNextDayOfWeek(dayName) {
    const days = {
      "Dimanche": 0, "Lundi": 1, "Mardi": 2, "Mercredi": 3,
      "Jeudi": 4, "Vendredi": 5, "Samedi": 6,
    };

    const today = new Date();
    const target = days[dayName];

    let next = new Date();
    next.setDate(today.getDate() + ((7 + target - today.getDay()) % 7));

    if (next.toDateString() === today.toDateString()) {
      next.setDate(next.getDate() + 7);
    }

    return next.toISOString().slice(0, 19).replace("T", " ");
  }

  async function scheduleWorkout(day) {
    if (!selectedWorkout) return;

    const date = getNextDayOfWeek(day);

    await updateWorkoutStartDate(selectedWorkout.id, user.id, date);

    setShowModal(false);
    setSelectedWorkout(null);

    alert(`Entraînement prévu pour ${day} (${date})`);

    loadWorkouts();
  }

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
        <View key={w.id}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate("WorkoutDetail", { workoutId: w.id })}
          >
            <Text style={[styles.name, { color: theme.colors.text }]}>{w.nom}</Text>
            <Text style={{ color: theme.colors.muted }}>{w.description}</Text>

            {w.started_at && (
              <Text style={{ color: theme.colors.accent }}>
                📅 Prévu le : {w.started_at}
              </Text>
            )}

            {w.ended_at && (
              <Text style={{ color: theme.colors.accent }}>
                ✔ Terminé le : {w.ended_at}
              </Text>
            )}
          </TouchableOpacity>

          {/* 🔥 Bouton PREVOIR */}
          <TouchableOpacity
            onPress={() => {
              setSelectedWorkout(w);
              setShowModal(true);
            }}
          >
            <Text style={{ color: theme.colors.accent, marginBottom: 15 }}>
              📅 Prévoir cet entraînement
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* 🔥 MODAL POUR CHOISIR LE JOUR */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
              Choisir un jour
            </Text>

            {["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"].map((d) => (
              <TouchableOpacity key={d} onPress={() => scheduleWorkout(d)}>
                <Text style={styles.dayItem}>{d}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: "red", marginTop: 20 }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  createBtn: { padding: 15, borderRadius: 12, marginBottom: 20 },
  createBtnText: { color: "white", fontSize: 18, textAlign: "center", fontWeight: "bold" },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%"
  },
  dayItem: {
    fontSize: 18,
    paddingVertical: 8
  }
});
