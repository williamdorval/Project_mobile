import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../context/AuthContext";

import {
  getUserById,
  getNextWorkout,
  getLastStats,
  getWeakMuscles
} from "../services/martha";  

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  const [loadingData, setLoadingData] = useState(true);

  const [user, setUser] = useState(null);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [lastStats, setLastStatsState] = useState([]);
  const [weakMuscles, setWeakMusclesState] = useState([]);

  // 🔥 Load ONLY if user is logged in
  async function loadData(userId) {
    try {
      const u = await getUserById(userId);
      const w = await getNextWorkout(userId);
      const s = await getLastStats(userId);
      const weak = await getWeakMuscles(userId);

      setUser(u);
      setNextWorkout(w);
      setLastStatsState(s);
      setWeakMusclesState(weak);

    } catch (err) {
      console.error("Erreur HomeScreen :", err);
    }

    setLoadingData(false);
  }

  useEffect(() => {
    if (!authUser) {
      setLoadingData(false); // pas connecté → pas d'appel
      return;
    }

    loadData(authUser.id);
  }, [authUser]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* HEADER */}
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {authUser ? `Salut ${authUser.username} 👋` : "Bienvenue à GymRank 💪"}
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
        Améliore ton physique jour après jour.
      </Text>

      {/* RANK */}
      <View style={[styles.rankBox, { borderColor: theme.colors.accent }]}>
        <Text style={[styles.rankLabel, { color: theme.colors.muted }]}>Ton rank</Text>

        {authUser && user ? (
          <Text style={[styles.rankValue, { color: theme.colors.accent }]}>{user.rank}</Text>
        ) : (
          <Text style={[styles.rankValue, { color: theme.colors.muted }]}>Veuillez vous connecter</Text>
        )}
      </View>

      {/* START TRAINING */}
      <TouchableOpacity 
        onPress={() => {
          if (!authUser) return alert("Veuillez vous connecter.");
          navigation.navigate("Entrainement");
        }}
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={styles.buttonText}>Commencer un entraînement 🔥</Text>
      </TouchableOpacity>

      {/* NEXT WORKOUT SECTION */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Prochain entraînement
        </Text>

        {loadingData && authUser ? (
          <ActivityIndicator color={theme.colors.accent} />
        ) : !authUser ? (
          <Text style={{ color: theme.colors.muted }}>Veuillez vous connecter</Text>
        ) : nextWorkout ? (
          <>
            <Text style={[styles.sectionText, { color: theme.colors.accent }]}>
              {nextWorkout.nom}
            </Text>
            <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
              {nextWorkout.description}
            </Text>
            <Text style={[styles.sectionText, { color: theme.colors.muted }]}>
              {nextWorkout.started_at}
            </Text>
          </>
        ) : (
          <Text style={{ color: theme.colors.muted }}>Aucun entraînement prévu.</Text>
        )}

      </View>

      {/* LAST STATS SECTION */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Dernières performances 📈
        </Text>

        {!authUser ? (
          <Text style={{ color: theme.colors.muted }}>Veuillez vous connecter</Text>
        ) : lastStats.length === 0 ? (
          <Text style={{ color: theme.colors.muted }}>Aucune statistique.</Text>
        ) : (
          lastStats.map((s) => (
            <Text key={s.id} style={[styles.statItem, { color: theme.colors.muted }]}>
              {s.exercice} — {s.poids} kg × {s.reps}
            </Text>
          ))
        )}

      </View>

      {/* WEAK MUSCLES SECTION */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Points faibles à travailler 💪
        </Text>

        {!authUser ? (
          <Text style={{ color: theme.colors.muted }}>Veuillez vous connecter</Text>
        ) : weakMuscles.length === 0 ? (
          <Text style={{ color: theme.colors.muted }}>Aucun point faible détecté</Text>
        ) : (
          weakMuscles.map((m, i) => (
            <Text key={i} style={[styles.statItem, { color: theme.colors.muted }]}>
              {m.groupe} → {m.exercice}
            </Text>
          ))
        )}

      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },

  rankBox: {
    borderWidth: 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center"
  },

  rankLabel: { fontSize: 14 },
  rankValue: { fontSize: 20, fontWeight: "600", marginTop: 5 },

  button: { padding: 15, borderRadius: 10, marginBottom: 20 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' },

  section: { padding: 20, borderRadius: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sectionText: { fontSize: 16 },
  statItem: { fontSize: 15, marginBottom: 5 },
});