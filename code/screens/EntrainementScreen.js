import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  getUserWorkouts,
  updateWorkoutStartDate,
  deleteWorkout,
} from "../services/martha";

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
      Dimanche: 0,
      Lundi: 1,
      Mardi: 2,
      Mercredi: 3,
      Jeudi: 4,
      Vendredi: 5,
      Samedi: 6,
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
    loadWorkouts();
  }

  function confirmDelete(workout) {
    Alert.alert(
      "Supprimer l'entraînement",
      `Voulez-vous vraiment supprimer "${workout.nom}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(workout.id, user.id);
            loadWorkouts();
          },
        },
      ]
    );
  }

  /* 🔥 ACTIONS SWIPE : MODIFIER + SUPPRIMER */
  function renderSwipeActions(workout) {
    return (
      <View style={styles.swipeActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            navigation.navigate("CreateWorkout", { workoutId: workout.id })
          }
        >
          <Text style={styles.actionText}>✏️ Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => confirmDelete(workout)}
        >
          <Text style={styles.actionText}>🗑 Supprimer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Mes Entraînements
        </Text>

        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: theme.colors.accent }]}
          onPress={() => navigation.navigate("CreateWorkout")}
        >
          <Text style={styles.createBtnText}>➕ Créer un entraînement</Text>
        </TouchableOpacity>

        {workouts.map((w) => (
          <View key={w.id}>
            <Swipeable renderRightActions={() => renderSwipeActions(w)}>
              <TouchableOpacity
                style={[styles.card, { backgroundColor: theme.colors.card }]}
                onPress={() =>
                  navigation.navigate("WorkoutDetail", { workoutId: w.id })
                }
              >
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {w.nom}
                </Text>
                <Text style={{ color: theme.colors.muted }}>
                  {w.description}
                </Text>

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
            </Swipeable>

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

        {/* MODAL PLANIFICATION */}
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              {[
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
                "Dimanche",
              ].map((d) => (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15 },
  createBtn: { padding: 15, borderRadius: 12, marginBottom: 20 },
  createBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },

  /* SWIPE */
  swipeActions: {
    flexDirection: "row",
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  deleteBtn: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  dayItem: { fontSize: 18, paddingVertical: 8 },
});