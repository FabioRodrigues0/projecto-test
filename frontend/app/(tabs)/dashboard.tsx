import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import getImageMapping from "@/hooks/useGetImage";

// 🔹 Definição do tipo de usuário
interface Products {
  id: number;
  client_id: number;
  product_id: number;
  name: string;
  description: string;
  image_url: string;
}

const imageMapping = getImageMapping();

interface ItemProps {
  image: string;
  title: string;
}

const ItemComponent: React.FC<ItemProps> = ({ image, title }) => {
  console.log(imageMapping[image]);
  return (
    <View style={styles.item}>
      <Image
        style={styles.stretch}
        source={
          image in imageMapping
            ? imageMapping[image]
            : require("@images/defaultImage.webp")
        }
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default function DashboardScreen() {
  const [products, setProducts] = useState<Array<Products> | null>([]);
  const { user } = useAuth();

  const getProducts = async (id: number) => {
    try {
      axios
        .get(`http://localhost:8000/api/client/products`, {
          params: {
            id: id,
          },
        })
        .then(function (response) {
          setProducts(response.data.products);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
      console.error(error);
    }
  };

  useEffect(() => {
    try {
      if (user) {
        getProducts(user.id);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
      console.error(error);
    }
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={150}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            numColumns={3}
            data={products}
            renderItem={({ item }) => (
              <ItemComponent title={item.name} image={item.image_url} />
            )}
            keyExtractor={(products) => products.id}
          />
        </SafeAreaView>
      </SafeAreaProvider>
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
    borderRadius: 15,
    backgroundColor: "#f9c2ff",
    marginVertical: 8,
    marginHorizontal: 16,
    width: 200,
    height: 300,
  },
  title: {
    margin: 10,
    fontSize: 26,
  },
  stretch: {
    borderTopLeftRadius: 15,
    borderTopEndRadius: 15,
    width: 200,
    height: 230,
    resizeMode: "stretch",
  },
});
