import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import {
  getUserWorkouts,
  getWorkoutDates,
  getMonthlyWorkoutCount,
  getUserStreak,
} from "../services/martha";

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const [workouts, setWorkouts] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [monthCount, setMonthCount] = useState(0);
  const [streak, setStreak] = useState(0);

 
  async function loadProfileData() {
    if (!user) return;

    const w = await getUserWorkouts(user.id);
    const days = await getWorkoutDates(user.id);
    const count = await getMonthlyWorkoutCount(user.id);
    const st = await getUserStreak(user.id);

    setWorkouts(w);
    setMonthCount(count);
    setStreak(st);

    const m = {};
    days.forEach((d) => {
      m[d.day] = {
        marked: true,
        selected: true,
        selectedColor: theme.colors.accent,
      };
    });

    setMarkedDates(m);
  }


  useFocusEffect(
    useCallback(() => {
      if (user) loadProfileData();
    }, [user])
  );


  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.bigIcon, { color: theme.colors.accent }]}>🔒</Text>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          Vous n’êtes pas connecté
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
          Connectez-vous pour accéder à votre progression, vos objectifs,
          votre calendrier et suivre vos entraînements.
        </Text>

        <TouchableOpacity
          style={[styles.bigButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.bigButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bigButtonOutline,
            { borderColor: theme.colors.accent },
          ]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text
            style={[
              styles.bigButtonOutlineText,
              { color: theme.colors.accent },
            ]}
          >
            Créer un compte
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

 
  return (
    <SafeAreaView
    style={{ flex: 1, backgroundColor: theme.colors.background }}
    edges={["top"]}
  >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Profil</Text>

      
        

    
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.accent, marginTop: 20 },
          ]}
        >
          Mon compte
        </Text>

        <View style={[styles.accountBox, { backgroundColor: theme.colors.card }]}>
          <Text style={styles.infoText}>
            Email : <Text style={styles.infoValue}>{user.email}</Text>
          </Text>

          <Text style={styles.infoText}>
            Prénom : <Text style={styles.infoValue}>{user.firstName || "—"}</Text>
          </Text>

          <Text style={styles.infoText}>
            Nom : <Text style={styles.infoValue}>{user.lastName || "—"}</Text>
          </Text>

          <Text style={styles.infoText}>
            Poids :{" "}
            <Text style={styles.infoValue}>
              {user.weight ? `${user.weight} kg` : "—"}
            </Text>
          </Text>

          <Text style={styles.infoText}>
            Taille :{" "}
            <Text style={styles.infoValue}>
              {user.height ? `${user.height} cm` : "—"}
            </Text>
          </Text>

          <Text style={styles.infoText}>
            Sexe : <Text style={styles.infoValue}>{user.gender || "—"}</Text>
          </Text>

          <Text style={styles.infoText}>
            Objectif : <Text style={styles.infoValue}>{user.goal || "—"}</Text>
          </Text>

          {user.rank && (
            <Text style={styles.infoText}>
              Rang : <Text style={styles.infoValue}>{user.rank}</Text>
            </Text>
          )}
        </View>

        
        
        <TouchableOpacity
          style={[
            styles.setting,
            {
              backgroundColor: theme.colors.card,
              marginTop: 10,
              borderWidth: 1,
              borderColor: theme.colors.accent,
            },
          ]}
          onPress={() => navigation.navigate("CompleteProfile")}
        >
          <Text
            style={{
              color: theme.colors.accent,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            ✏️ Modifier mon profil
          </Text>
        </TouchableOpacity>

      
        <Text style={[styles.streak, { color: theme.colors.accent }]}>
          🔥 Streak : {streak} jours
        </Text>

        <View style={[styles.progressBox, { borderColor: theme.colors.accent }]}>
          <Text style={styles.progressTitle}>
            Entraînements ce mois-ci
          </Text>
          <Text style={[styles.progressNumber, { color: theme.colors.accent }]}>
            {monthCount}
          </Text>
        </View>

        <Calendar
          markingType="simple"
          markedDates={markedDates}
          theme={{
            calendarBackground: theme.colors.card,
            dayTextColor: theme.colors.text,
            monthTextColor: theme.colors.accent,
            todayTextColor: theme.colors.accent,
          }}
        />

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

      
        <TouchableOpacity
          style={[
            styles.setting,
            { backgroundColor: theme.colors.card, marginTop: 20 },
          ]}
          onPress={logout}
        >
          <Text style={{ color: theme.colors.text }}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  centerContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 30 },

  bigIcon: { fontSize: 80, marginBottom: 20 },

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

  setting: { padding: 15, borderRadius: 12, marginBottom: 10 },

  infoText: { color: "#888", marginBottom: 5 },

  infoValue: { fontWeight: "bold", color: "#000" },

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
});
