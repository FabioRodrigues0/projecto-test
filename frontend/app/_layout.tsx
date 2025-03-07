import React from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "../hooks/useColorScheme";
import { AuthProvider } from "../components/AuthContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
