import React from "react";
import { Tabs } from "expo-router";
import { useAuth } from "../../components/AuthContext";
import { Redirect } from "expo-router";

export default function TabsLayout() {
  const { user } = useAuth();

  // Verificar se o usuário está autenticado
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
        }}
      />
    </Tabs>
  );
}
