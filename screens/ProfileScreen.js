import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Calendar } from 'react-native-calendars';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>Mon Profil</Text>

      {/* 🔥 Streak */}
      <Text style={[styles.streak, { color: theme.colors.accent }]}>
        🔥 Streak actuel : 5 jours
      </Text>

      {/* 📅 Calendrier */}
      <Calendar
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.card,
          dayTextColor: theme.colors.text,
          monthTextColor: theme.colors.accent,
          arrowColor: theme.colors.accent,
          todayTextColor: theme.colors.accentAlt,
        }}

        markedDates={{
          '2025-01-10': { selected: true, selectedColor: theme.colors.accent },
          '2025-01-11': { selected: true, selectedColor: theme.colors.accent },
          '2025-01-12': { selected: true, selectedColor: theme.colors.accent },
        }}
        style={{
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      {/* ⚙️ Paramètres */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Paramètres
      </Text>

      <TouchableOpacity 
        style={[styles.setting, { backgroundColor: theme.colors.card }]}
        onPress={theme.toggle}
      >
        <Text style={{ color: theme.colors.text }}>Activer / Désactiver Dark Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.setting, { backgroundColor: theme.colors.card }]}
      >
        <Text style={{ color: theme.colors.text }}>Modifier Profil</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  streak: { fontSize: 18, marginBottom: 20 },
  sectionTitle: { fontSize: 20, marginTop: 10, marginBottom: 10 },
  setting: { padding: 15, borderRadius: 10, marginBottom: 10 },
});
