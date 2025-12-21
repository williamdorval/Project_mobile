import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import ExercicesScreen from "./screens/ExercisesScreen";
import MainTabs from "./components/BottomNav";
import EntrainementScreen from "./screens/EntrainementScreen";
import CreateWorkoutScreen from "./screens/CreateWorkoutScreen";
import WorkoutDetailScreen from "./screens/WorkoutDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* APP PRINCIPALE */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

     
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      
      <Stack.Screen
        name="CompleteProfile"
        component={CompleteProfileScreen}
      />

     
      <Stack.Screen name="Exercices" component={ExercicesScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      <Stack.Screen name="Entrainement" component={EntrainementScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

    </Stack.Navigator>
  );
}
