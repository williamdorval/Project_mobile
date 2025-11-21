import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import CompleteProfileScreen from "./screens/CompleteProfileScreen";

// 👉 CORRECTION : on importe BottomNav comme MainTabs
import MainTabs from "./components/BottomNav";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {!user && (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}

      {user && !user.profile && (
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      )}

      {user && user.profile && (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      )}

    </Stack.Navigator>
  );
}
