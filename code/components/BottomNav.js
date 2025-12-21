import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import HomeScreen from "../screens/HomeScreen";
import EntrainementScreen from "../screens/EntrainementScreen";
import StatistiquesScreen from "../screens/StatistiquesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { backgroundColor: theme.colors.card },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Entrainement: "flame",
            Statistiques: "stats-chart",
            Profile: "person",
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      {/* ✅ TOUJOURS */}
      <Tab.Screen name="Home" component={HomeScreen} />

      {/* ✅ SEULEMENT SI CONNECTÉ → 4 tabs total */}
      {user && (
        <>
          <Tab.Screen name="Entrainement" component={EntrainementScreen} />
          <Tab.Screen name="Statistiques" component={StatistiquesScreen} />
        </>
      )}

      {/* ✅ TOUJOURS */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
