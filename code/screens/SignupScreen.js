import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function SignupScreen({ navigation }) {
  const theme = useTheme();
  const { signup } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      setError("");
      await signup(username, email, password);

      navigation.reset({
        index: 0,
        routes: [{ name: "CompleteProfile" }],
      });
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Créer un compte</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Username"
        placeholderTextColor={theme.colors.muted}
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor={theme.colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: theme.colors.accent }]}>
          Déjà un compte ? Connexion
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
  input: { padding: 14, borderRadius: 12, marginBottom: 15 },
  button: { padding: 15, borderRadius: 12, marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  link: { marginTop: 10, textAlign: "center", fontSize: 16 },
});
