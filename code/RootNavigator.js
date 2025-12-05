import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import ExercicesScreen from "./screens/ExercisesScreen";
import MainTabs from "./components/BottomNav";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* Tabs */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Auth */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      
      {/* Profil à compléter */}
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />

      {/* Exercices */}
      <Stack.Screen name="Exercices" component={ExercicesScreen} />

    </Stack.Navigator>
  );
}
