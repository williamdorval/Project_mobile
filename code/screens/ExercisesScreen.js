import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { getExercicesByMuscle } from "../services/martha";
import { SafeAreaView } from "react-native-safe-area-context";


export default function ExercicesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { groupe } = route.params;

  const [loading, setLoading] = useState(true);
  const [exercices, setExercices] = useState([]);

  async function loadData() {
    try {
      const data = await getExercicesByMuscle(groupe);
      setExercices(data);
    } catch (err) {
      console.error("Erreur chargement exercices :", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Exercices : {groupe}
      </Text>

      {/* 🔥 Bouton pour aller gérer les workouts */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        onPress={() => navigation.navigate("Workouts")}
      >
        <Text style={styles.buttonText}>Commencer un entraînement</Text>
      </TouchableOpacity>

      {exercices.length === 0 && (
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>
          Aucun exercice trouvé.
        </Text>
      )}

      {exercices.map((ex) => (
        <View key={ex.id} style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{ex.name}</Text>

          {ex.moyenne_monde_poid !== null && (
            <Text style={{ color: theme.colors.textSecondary }}>
              Moyenne monde : {ex.moyenne_monde_poid} lbs
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  button: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  card: { padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "bold" },
});