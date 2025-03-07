import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../components/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <View>
        <Text>Perfil</Text>
        <Button title="Sair" onPress={handleLogout} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
