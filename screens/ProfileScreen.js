import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'react-native-calendars';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, logout } = useAuth();

  
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Tu n’es pas connecté</Text>

        <TouchableOpacity
          style={[styles.setting, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={{ color: theme.colors.text }}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.setting, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={{ color: theme.colors.text }}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Mon Profil</Text>

      <Text style={{ color: theme.colors.muted, marginBottom: 15 }}>
        Connecté en tant que : {user.email}
      </Text>

      <Text style={[styles.streak, { color: theme.colors.accent }]}>
        🔥 Streak actuel : 5 jours
      </Text>

      <Calendar
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.card,
          dayTextColor: theme.colors.text,
          monthTextColor: theme.colors.accent,
          arrowColor: theme.colors.accent,
          todayTextColor: theme.colors.accent,
        }}
      />

      <TouchableOpacity
        style={[styles.setting, { backgroundColor: theme.colors.card, marginTop: 20 }]}
        onPress={logout}
      >
        <Text style={{ color: theme.colors.text }}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  streak: { fontSize: 18, marginBottom: 20 },
  setting: { padding: 15, borderRadius: 10, marginBottom: 10 },
});
