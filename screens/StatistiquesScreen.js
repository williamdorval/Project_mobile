import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function StatistiquesScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>Tes Ranks Musculaires</Text>

      <View style={styles.body}>
        <Text style={{ color: theme.colors.accent }}>🟥 Poitrine : Rank B</Text>
        <Text style={{ color: theme.colors.accent }}>🟩 Dos : Rank A</Text>
        <Text style={{ color: theme.colors.accent }}>🟦 Jambes : Rank C</Text>
        <Text style={{ color: theme.colors.accent }}>🟨 Bras : Rank S</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  body: { marginTop: 10, gap: 10 }
});
