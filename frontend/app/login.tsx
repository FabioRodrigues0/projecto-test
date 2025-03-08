import React from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useAuth } from "../components/AuthContext";
import { Storage } from "../hooks/storage";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
export default function LoginScreen() {
  const [email, onChangeInputEmail] = React.useState("");
  const [password, onChangeInputPassword] = React.useState("");
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();
  const { login, user } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Armazenar token se existir
        Storage.setItem("authToken", "o_token_do_user");

        // Login
        login(data.user);
        router.replace("/(tabs)/dashboard");
      } else {
        Alert.alert("Erro", data.error);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
      console.error(error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Login</ThemedText>
        </ThemedView>
        <ThemedTextInput
          name="email"
          type="email-address"
          placeholderProp="Insira o Email"
          textContentType="emailAddress"
          value={email}
          onChangeProp={(text) => onChangeInputEmail(text)}
        />
        <ThemedTextInput
          name="password"
          secure={passwordVisibility}
          type="default"
          placeholderProp="Insira a Password"
          textContentType="password"
          secureTextEntry={true}
          value={password}
          onChangeProp={(text) => onChangeInputPassword(text)}
          caretHidden={true}
          rightIcon={rightIcon}
          handlePasswordVisibility={handlePasswordVisibility}
        />
        <View style={styles.fixToText}>
          <Button title="Register" />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    width: 400,
  },
  fixToText: {
    gap: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
