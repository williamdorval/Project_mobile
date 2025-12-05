import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Calendar } from 'react-native-calendars';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Text style={[styles.title, { color: theme.colors.text }]}>Profil</Text>

      {/* PARAMÈTRES APP */}
      <Text style={[styles.sectionTitle, { color: theme.colors.accent }]}>
        Paramètres de l’application
      </Text>

      <View style={[styles.setting, { backgroundColor: theme.colors.card }]}>
        <Text style={{ color: theme.colors.text }}>Mode sombre</Text>

        <Switch
          value={theme.dark}
          onValueChange={theme.toggle}
          thumbColor={theme.colors.accent}
          trackColor={{ true: theme.colors.accentAlt, false: theme.colors.muted }}
        />
      </View>

      {/* PAS CONNECTÉ */}
      {!user && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.accent, marginTop: 20 }]}>
            Compte
          </Text>

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
        </>
      )}

      {/* CONNECTÉ */}
      {user && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.accent, marginTop: 20 }]}>
            Mon compte
          </Text>

          <View style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.colors.text }}>
              Connecté en tant que : {user.email}
            </Text>
          </View>

          {/* ➕ INFOS AJOUTÉES : POIDS / TAILLE / OBJECTIF */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: theme.colors.text }}>
              Poids : <Text style={{ color: theme.colors.accent }}>{user.weight || "Non défini"} kg</Text>
            </Text>

            <Text style={{ color: theme.colors.text }}>
              Taille : <Text style={{ color: theme.colors.accent }}>{user.height_cm || "Non défini"} cm</Text>
            </Text>

            <Text style={{ color: theme.colors.text }}>
              Objectif : <Text style={{ color: theme.colors.accent }}>{user.goal || "Aucun"}</Text>
            </Text>
          </View>

          {/* STREAK */}
          <Text style={[styles.streak, { color: theme.colors.accent }]}>
            🔥 Streak actuel : 5 jours
          </Text>

          {/* CALENDRIER */}
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

          {/* LOGOUT */}
          <TouchableOpacity
            style={[styles.setting, { backgroundColor: theme.colors.card, marginTop: 20 }]}
            onPress={logout}
          >
            <Text style={{ color: theme.colors.text }}>Se déconnecter</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  streak: { fontSize: 18, marginBottom: 20 },
  setting: { 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
});
