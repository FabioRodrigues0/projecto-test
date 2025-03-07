import { Redirect } from "expo-router";
import { useAuth } from "../components/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Redirecionar baseado no estado de autenticação
  return user ? (
    <Redirect href={"/(tabs)/dashboard"} />
  ) : (
    <Redirect href="/login" />
  );
}
