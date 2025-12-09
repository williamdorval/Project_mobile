import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserMuscleScores } from "../services/martha";

export default function StatistiquesScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const width = Dimensions.get("window").width - 20;

  const [muscleStats, setMuscleStats] = useState([]);
  const [globalRank, setGlobalRank] = useState("C");

  useEffect(() => {
    async function load() {
      if (!user) return;

      const stats = await getUserMuscleScores(user.id);
      setMuscleStats(stats);

      // ⚡ Calcul du rank global
      let total = 0;
      stats.forEach((m) => total += m.rankScore);
      const avg = total / stats.length;

      setGlobalRank(rankFromScore(avg));
    }
    load();
  }, [user]);

  function rankFromScore(score) {
    if (score >= 120) return "S";
    if (score >= 100) return "A";
    if (score >= 80) return "B";
    if (score >= 60) return "C";
    return "D";
  }

  // 🔥 Podium data
  const podium = [...muscleStats].sort((a, b) => b.rankScore - a.rankScore).slice(0, 3);

  // Radar / ProgressChart data
  const radarData = {
    labels: muscleStats.map((m) => m.groupe),
    data: muscleStats.map((m) => Math.min(1, m.rankScore / 120)),
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* 🔥 PODIUM */}
      <Text style={[styles.title, { color: theme.colors.text }]}>Podium Musculaire</Text>
      
      <View style={styles.podium}>
        {podium.map((m, i) => (
          <View key={i} style={[styles.podiumItem, { borderColor: theme.colors.accent }]}>
            <Text style={[styles.podiumRank, { color: theme.colors.accent }]}>
              #{i + 1}
            </Text>
            <Text style={[styles.podiumLabel, { color: theme.colors.text }]}>
              {m.groupe}
            </Text>
            <Text style={[styles.podiumScore, { color: theme.colors.accent }]}>
              {rankFromScore(m.rankScore)}
            </Text>
          </View>
        ))}
      </View>

      {/* 🔥 RANK GLOBAL */}
      <View style={[styles.globalRankBox, { borderColor: theme.colors.accent }]}>
        <Text style={{ color: theme.colors.text, fontSize: 18 }}>Rank Global</Text>
        <Text style={{ color: theme.colors.accent, fontSize: 45, fontWeight: "900" }}>
          {globalRank}
        </Text>
      </View>

      {/* 🔥 RADAR CHART */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Répartition Force Musculaire
      </Text>

      <ProgressChart
        data={radarData}
        width={width}
        height={220}
        strokeWidth={14}
        radius={30}
        chartConfig={{
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          color: () => theme.colors.accent,
          labelColor: () => theme.colors.text,
        }}
        style={styles.chart}
      />

      {/* 🔥 BAR CHART */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Score par groupe musculaire
      </Text>

      <BarChart
        data={{
          labels: muscleStats.map((m) => m.groupe),
          datasets: [{ data: muscleStats.map((m) => m.rankScore) }],
        }}
        width={width}
        height={260}
        chartConfig={{
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          color: () => theme.colors.accent,
          labelColor: () => theme.colors.text,
        }}
        style={styles.chart}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  title: { fontSize: 32, fontWeight: "900", marginBottom: 20, textAlign: "center" },

  section: { fontSize: 20, fontWeight: "700", marginBottom: 10, marginTop: 20 },

  chart: { borderRadius: 16 },

  podium: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  podiumItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    width: "30%",
  },

  podiumRank: { fontSize: 22, fontWeight: "900" },
  podiumLabel: { fontSize: 16, marginTop: 5 },
  podiumScore: { fontSize: 28, fontWeight: "900", marginTop: 5 },

  globalRankBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: "center",
    marginBottom: 20,
  },
});