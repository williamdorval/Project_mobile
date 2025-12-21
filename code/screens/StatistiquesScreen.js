import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { BarChart, ProgressChart } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getUserMuscleScores, updateUserRank, getUserDiscipline } from "../services/martha";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


export default function StatistiquesScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const width = Dimensions.get("window").width - 20;

  const [muscleStats, setMuscleStats] = useState([]);
  const [globalRank, setGlobalRank] = useState("C");

useFocusEffect(
  useCallback(() => {
    async function load() {
      if (!user) return;

      const stats = await getUserMuscleScores(user.id);
      console.log("🔥 STATS BRUTES REÇUES =", stats);

      setMuscleStats(stats || []);

      let disciplineData = null;
      try {
        disciplineData = await getUserDiscipline(user.id);
      } catch (e) {
        console.log("Erreur getUserDiscipline :", e);
      }

      const recentWorkouts =
        disciplineData?.recent_workouts ?? 0;

      const forceScores = (stats || []).map(m => m.rankScore || 0);
      const force =
        forceScores.length > 0
          ? forceScores.reduce((a, b) => a + b, 0) / forceScores.length
          : 0;

      const disciplineScore = Math.min(100, (recentWorkouts / 28) * 100);

      let variance = 0;
      const avgF =
        forceScores.length > 0
          ? forceScores.reduce((a, b) => a + b, 0) / forceScores.length
          : 0;

      forceScores.forEach(f => {
        variance += Math.pow(f - avgF, 2);
      });

      variance = forceScores.length > 0 ? variance / forceScores.length : 0;
      const consistence = Math.max(0, 100 - variance);

      const final = (force + disciplineScore + consistence) / 3;
      const newRank = rankFromScore(final);

      setGlobalRank(newRank);
      await updateUserRank(user.id, newRank);
    }

    load();
  }, [user])
);


  function rankFromScore(score) {
    if (score >= 150) return "S";
    if (score >= 125) return "A";
    if (score >= 95) return "B";
    if (score >= 60) return "C";
    return "D";
  }

  
  const podium = [...muscleStats]
    .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0))
    .slice(0, 3);

  
  const radarData = {
    labels: muscleStats.map(m => m.groupe),
    data: muscleStats.map(m => Math.min(1, (m.rankScore || 0) / 120))
  };

  return (
    <SafeAreaView
    style={{ flex: 1, backgroundColor: theme.colors.background }}
    edges={["top"]}
  >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Podium Musculaire
        </Text>

        <View style={styles.podium}>
          {podium.map((m, i) => (
            <View
              key={i}
              style={[styles.podiumItem, { borderColor: theme.colors.accent }]}
            >
              <Text style={[styles.podiumRank, { color: theme.colors.accent }]}>
                #{i + 1}
              </Text>
              <Text style={[styles.podiumLabel, { color: theme.colors.text }]}>
                {m.groupe}
              </Text>
              <Text style={[styles.podiumScore, { color: theme.colors.accent }]}>
                {rankFromScore(m.rankScore || 0)}
              </Text>
            </View>
          ))}
        </View>

        
        <View
          style={[styles.globalRankBox, { borderColor: theme.colors.accent }]}
        >
          <Text style={{ color: theme.colors.text, fontSize: 18 }}>
            Rank Global
          </Text>
          <Text
            style={{
              color: theme.colors.accent,
              fontSize: 45,
              fontWeight: "900"
            }}
          >
            {globalRank}
          </Text>
        </View>

        
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
            labelColor: () => theme.colors.text
          }}
          style={styles.chart}
        />

      
        <Text style={[styles.section, { color: theme.colors.accent }]}>
          Score par groupe musculaire
        </Text>

        <BarChart
          data={{
            labels: muscleStats.map(m => m.groupe),
            datasets: [{ data: muscleStats.map(m => m.rankScore || 0) }]
          }}
          width={width}
          height={260}
          chartConfig={{
            backgroundGradientFrom: theme.colors.card,
            backgroundGradientTo: theme.colors.card,
            color: () => theme.colors.accent,
            labelColor: () => theme.colors.text
          }}
          style={styles.chart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center"
  },

  section: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20
  },

  chart: { borderRadius: 16 },

  podium: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20
  },

  podiumItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    width: "30%"
  },

  podiumRank: { fontSize: 22, fontWeight: "900" },
  podiumLabel: { fontSize: 16, marginTop: 5 },
  podiumScore: { fontSize: 28, fontWeight: "900", marginTop: 5 },

  globalRankBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 3,
    alignItems: "center",
    marginBottom: 20
  }
});
