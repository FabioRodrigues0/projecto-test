import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList } from "../types/navigation";
import { useAuth } from "../components/AuthContext";
import LoginScreen from "../app/login";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<StackParamList>();

const MainNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Tabs" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
