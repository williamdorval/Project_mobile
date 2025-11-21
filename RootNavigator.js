import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomNav from './components/BottomNav';


const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomNav} />
    </Stack.Navigator>
  );
}
