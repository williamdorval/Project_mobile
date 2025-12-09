import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart, BarChart, ProgressChart, ContributionGraph } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";

export default function StatistiquesScreen() {
  const theme = useTheme();
  const screenWidth = Dimensions.get("window").width - 20;

  // 🔥 Fake data (tu vas brancher à Martha ensuite)
  const lineData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        data: [40, 45, 48, 50, 55, 60],
        color: () => theme.colors.accent,
        strokeWidth: 3,
      },
    ],
  };

  const barData = {
    labels: ["Pect", "Dos", "Jambes", "Bras", "Épaules"],
    datasets: [
      {
        data: [7800, 10200, 5400, 6600, 4800],
      },
    ],
  };

  const radarData = {
    labels: ["Pectoraux", "Dos", "Jambes", "Bras", "Épaules"],
    data: [0.8, 0.9, 0.6, 1.0, 0.7],
  };

  const heatmapData = [
    { date: "2025-02-01", count: 1 },
    { date: "2025-02-03", count: 3 },
    { date: "2025-02-12", count: 2 },
    { date: "2025-02-15", count: 4 },
    { date: "2025-02-17", count: 1 },
    { date: "2025-02-20", count: 3 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        📊 Statistiques d’entraînement
      </Text>

      {/* ------------------- LINE CHART ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Progression des poids (Bench Press)
      </Text>

      <LineChart
        data={lineData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          color: () => theme.colors.accent,
          labelColor: () => theme.colors.text,
          propsForDots: { r: "5" },
        }}
        style={styles.chart}
      />

      {/* ------------------- BAR CHART ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Volume total par groupe musculaire
      </Text>

      <BarChart
        data={barData}
        width={screenWidth}
        height={250}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          decimalPlaces: 0,
          color: () => theme.colors.accent,
          labelColor: () => theme.colors.text,
        }}
        style={styles.chart}
      />

      {/* ------------------- RADAR CHART (ProgressChart) ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Force relative par groupe (Radar Chart)
      </Text>

      <ProgressChart
        data={radarData}
        width={screenWidth}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          color: () => theme.colors.accent,
          labelColor: () => theme.colors.text,
        }}
        style={styles.chart}
      />

      {/* ------------------- HEATMAP ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Fréquence d'entraînement (Heatmap)
      </Text>

      <ContributionGraph
        values={heatmapData}
        endDate={new Date("2025-02-28")}
        numDays={30}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.card,
          backgroundGradientFrom: theme.colors.card,
          backgroundGradientTo: theme.colors.card,
          color: (opacity = 1) => theme.colors.accent,
        }}
        style={styles.chart}
      />

      {/* ------------------- RANK MUSCULAIRE ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Rangs musculaires
      </Text>

      <View style={styles.rankBox}>
        <Text style={[styles.rank, { color: "#ff4d4d" }]}>🟥 Poitrine : Rank B</Text>
        <Text style={[styles.rank, { color: "#4dff4d" }]}>🟩 Dos : Rank A</Text>
        <Text style={[styles.rank, { color: "#4da6ff" }]}>🟦 Jambes : Rank C</Text>
        <Text style={[styles.rank, { color: "#ffd24d" }]}>🟨 Bras : Rank S</Text>
      </View>

      {/* ------------------- STATISTIQUES CLÉS ------------------- */}
      <Text style={[styles.section, { color: theme.colors.accent }]}>
        Statistiques clés
      </Text>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statTitle, { color: theme.colors.text }]}>Bench Max</Text>
        <Text style={[styles.statValue, { color: theme.colors.accent }]}>100 kg</Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statTitle, { color: theme.colors.text }]}>PR Total</Text>
        <Text style={[styles.statValue, { color: theme.colors.accent }]}>+14% ce mois-ci</Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statTitle, { color: theme.colors.text }]}>Volume record</Text>
        <Text style={[styles.statValue, { color: theme.colors.accent }]}>10 200 kg</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 30, fontWeight: "900", marginBottom: 15, textAlign: "center" },
  section: { fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 10 },
  chart: { borderRadius: 16 },
  rankBox: { marginTop: 10, marginBottom: 20 },
  rank: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  statCard: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
  },
  statTitle: { fontSize: 18, fontWeight: "600" },
  statValue: { fontSize: 28, fontWeight: "900", marginTop: 5 },
});
