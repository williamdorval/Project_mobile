import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Bienvenue à GymRank 
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.muted }]}>
        Améliore ton physique jour après jour.
      </Text>

     
      <TouchableOpacity 
        onPress={() => navigation.navigate("Entrainement")}
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
      >
        <Text style={styles.buttonText}>Commencer un entraînement</Text>
      </TouchableOpacity>

     
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Programme</Text>
          <Text style={[styles.cardText, { color: theme.colors.muted }]}>Ton plan du jour</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Statistiques</Text>
          <Text style={[styles.cardText, { color: theme.colors.muted }]}>Progression globale</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  button: { padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  cards: { marginTop: 25 },
  card: { padding: 20, borderRadius: 15, marginBottom: 15 },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardText: { fontSize: 14, marginTop: 5 },
});
