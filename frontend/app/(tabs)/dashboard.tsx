import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Platform,
  Modal,
  Alert,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
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
  item: Products;
}

export default function DashboardScreen() {
  const [products, setProducts] = useState<Array<Products> | null>([]);
  const { user } = useAuth();
  const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

  const ItemComponent: React.FC<ItemProps> = ({ item }) => {
    return (
      <Pressable
        onPress={() => {
          setSelectedProduct(item);
          setModalDetailsVisible(true);
        }}
      >
        <View style={styles.item}>
          <Image
            style={styles.stretch}
            source={
              item.image_url in imageMapping
                ? imageMapping[item.image_url]
                : require("@images/defaultImage.webp")
            }
          />
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </Pressable>
    );
  };

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetailsVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalDetailsVisible(!modalDetailsVisible);
        }}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <Image
              style={styles.stretch}
              source={
                selectedProduct?.image_url || "" in imageMapping
                  ? imageMapping[selectedProduct?.image_url || ""]
                  : require("@images/defaultImage.webp")
              }
            />
            <ThemedText style={styles.modalText}>
              {selectedProduct?.name || ""}
            </ThemedText>
            <ThemedText style={styles.modalText}>
              {selectedProduct?.description || ""}
            </ThemedText>
            <Button
              title="Fechar"
              onPress={() => {
                setModalDetailsVisible(!modalDetailsVisible);
              }}
            />
          </ThemedView>
        </ThemedView>
      </Modal>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            numColumns={3}
            data={products}
            renderItem={({ item }) => <ItemComponent item={item} />}
            keyExtractor={(products) => products.id}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
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
