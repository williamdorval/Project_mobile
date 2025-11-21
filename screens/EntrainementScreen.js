import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EntrainementScreen() {
  const theme = useTheme();

  const muscles = ["Poitrine", "Dos", "Épaules", "Jambes", "Bras", "Abdos"];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Sélection muscle</Text>

      {muscles.map((m, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.card, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.cardText, { color: theme.colors.text }]}>{m}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15 },
  card: { padding: 18, borderRadius: 12, marginBottom: 10 },
  cardText: { fontSize: 18 },
});
