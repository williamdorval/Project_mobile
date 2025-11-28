import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const theme = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (!ok) {
      setError("Email ou mot de passe incorrect");
      return;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>Connexion</Text>

      {error ? <Text style={[styles.error, { color: "red" }]}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.muted}
        value={email}
        onChangeText={setEmail}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text }
        ]}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor={theme.colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[
          styles.input,
          { backgroundColor: theme.colors.card, color: theme.colors.text }
        ]}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        onPress={handleLogin}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={[styles.link, { color: theme.colors.accent }]}>
          Créer un compte
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  error: { marginBottom: 10, textAlign: "center", fontSize: 14 },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },
  link: { marginTop: 10, textAlign: "center", fontSize: 16 },
});
