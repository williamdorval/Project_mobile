import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext";
import ExercicesScreen from "./screens/ExercisesScreen";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import MainTabs from "./components/BottomNav";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

     
      <Stack.Screen name="MainTabs" component={MainTabs} />

      
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Exercices" component={ExercicesScreen} />
     
      {user && !user.profile && (
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      )}

    </Stack.Navigator>
  );
}
