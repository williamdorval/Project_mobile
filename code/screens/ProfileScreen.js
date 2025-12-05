import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import {
  getUserWorkouts,
  getWorkoutDates,
  getMonthlyWorkoutCount,
  getUserStreak
} from "../services/martha";

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [monthCount, setMonthCount] = useState(0);
  const [streak, setStreak] = useState(0);

  // Load everything from Martha
  async function loadProfileData() {
    if (!user) return;

    const w = await getUserWorkouts(user.id);
    const days = await getWorkoutDates(user.id);
    const count = await getMonthlyWorkoutCount(user.id);
    const st = await getUserStreak(user.id);

    setWorkouts(w);
    setMonthCount(count);
    setStreak(st);

    // Mark dates in calendar
    const m = {};
    days.forEach((d) => {
      m[d.day] = { 
        marked: true, 
        selected: true, 
        selectedColor: theme.colors.accent 
      };
    });

    setMarkedDates(m);
    setLoading(false);
  }

  useEffect(() => {
    loadProfileData();
  }, [user]);

  // -------------------------------
  // ❤️ ÉTAT NON CONNECTÉ (VERSION WOW)
  // -------------------------------
  if (!user) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        
        <Text style={[styles.bigIcon, { color: theme.colors.accent }]}>
          🔒
        </Text>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          Vous n’êtes pas connecté
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Connectez-vous pour accéder à votre progression, vos objectifs, votre calendrier
          et suivre vos entraînements du gym.
        </Text>

        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.bigButtonText}>Se connecter</Text>
        </TouchableOpacity>

        {/* SIGNUP BUTTON */}
        <TouchableOpacity
          style={[styles.bigButtonOutline, { borderColor: theme.colors.accent }]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={[styles.bigButtonOutlineText, { color: theme.colors.accent }]}>
            Créer un compte
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  // -------------------------------
  // ❤️ ÉTAT CONNECTÉ (VERSION FULL PRO)
  // -------------------------------
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Text style={[styles.title, { color: theme.colors.text }]}>Profil</Text>

      {/* SETTINGS */}
      <Text style={[styles.sectionTitle, { color: theme.colors.accent }]}>
        Paramètres
      </Text>

      <View style={[styles.setting, { backgroundColor: theme.colors.card }]}>
        <Text style={{ color: theme.colors.text }}>Mode sombre</Text>
        <Switch
          value={theme.dark}
          onValueChange={theme.toggle}
          thumbColor={theme.colors.accent}
        />
      </View>

      {/* USER INFO */}
      <Text style={[styles.sectionTitle, { color: theme.colors.accent, marginTop: 20 }]}>
        Mon compte
      </Text>

      <Text style={styles.infoText}>Email : {user.email}</Text>
      <Text style={styles.infoText}>
        Objectif : <Text style={styles.infoValue}>{user.goal || "Non défini"}</Text>
      </Text>
      <Text style={styles.infoText}>
        Poids : <Text style={styles.infoValue}>{user.weight || "?"} kg</Text>
      </Text>
      <Text style={styles.infoText}>
        Taille : <Text style={styles.infoValue}>{user.height_cm || "?"} cm</Text>
      </Text>

      {/* STREAK */}
      <Text style={[styles.streak, { color: theme.colors.accent }]}>
        🔥 Streak : {streak} jours
      </Text>

      {/* MONTHLY PROGRESSION */}
      <View style={[styles.progressBox, { borderColor: theme.colors.accent }]}>
        <Text style={styles.progressTitle}>Entraînements ce mois-ci :</Text>
        <Text style={[styles.progressNumber, { color: theme.colors.accent }]}>
          {monthCount}
        </Text>
      </View>

      {/* CALENDAR */}
      <Calendar
        markingType="simple"
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.card,
          dayTextColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.accent,
          todayTextColor: theme.colors.accent,
          monthTextColor: theme.colors.accent,
        }}
      />

      {/* LAST WORKOUTS */}
      <Text style={[styles.sectionTitle, { color: theme.colors.accent, marginTop: 20 }]}>
        Derniers entraînements
      </Text>

      {workouts.slice(0, 3).map((w) => (
        <View key={w.id} style={[styles.workoutCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.workoutTitle, { color: theme.colors.text }]}>{w.nom}</Text>
          <Text style={{ color: theme.colors.muted }}>{w.description}</Text>
          <Text style={{ color: theme.colors.accent }}>{w.started_at}</Text>
        </View>
      ))}

      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.setting, { backgroundColor: theme.colors.card, marginTop: 20 }]}
        onPress={logout}
      >
        <Text style={{ color: theme.colors.text }}>Se déconnecter</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// -------------------------
// 🎨 STYLES
// -------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centerContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 32, fontWeight: "900", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30 },
  bigIcon: { fontSize: 80, marginBottom: 20 },

  // Buttons
  bigButton: {
    width: "80%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  bigButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bigButtonOutline: {
    width: "80%",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  bigButtonOutlineText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  infoText: { color: "#ccc", marginBottom: 5 },
  infoValue: { fontWeight: "bold" },

  streak: { fontSize: 20, marginVertical: 15 },

  progressBox: {
    borderWidth: 3,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  progressTitle: { fontSize: 18, fontWeight: "bold" },
  progressNumber: { fontSize: 42, fontWeight: "900" },

  workoutCard: { padding: 15, borderRadius: 12, marginBottom: 12 },
  workoutTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});
