import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import React from "react";
import { Alert, Button, Modal, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../../components/AuthContext";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [id] = React.useState(user?.id);
  const [email, onChangeInputEmail] = React.useState(user?.email);
  const [name, onChangeInputName] = React.useState(user?.name);
  const [is_verify] = React.useState(user?.is_verify);
  const [clientNumber, setClientNumber] = React.useState(0);
  const [modalVerifyVisible, setModalVerifyVisible] = React.useState(false);
  const [modalDetailsVisible, setModalDetailsVisible] = React.useState(false);

  // logout
  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // verify user
  const verificarUser = async () => {
    const response = await fetch("http://localhost:8000/api/get-verify", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientNumber }),
    });
  };

  // update o verify do user
  const updateVerify = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
      } else {
        Alert.alert("Erro", data.error);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar ao servidor.");
      console.error(error);
    }
  };

  // update user
  const updateUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, email, name, is_verify }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "Perfil atualizado com sucesso.");
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
      <ThemedView style={styles.stepContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVerifyVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVerifyVisible(!modalVerifyVisible);
          }}
        >
          <ThemedView style={styles.centeredView}>
            <ThemedView style={styles.modalView}>
              <ThemedText style={styles.modalText}>
                Indique seu numero:
              </ThemedText>
              <ThemedTextInput
                dataDetectorTypes={"phoneNumber"}
                inputMode="tel"
                name="number"
                type="phone-pad"
                placeholderProp={clientNumber}
                textContentType="telephoneNumber"
                valueProp={clientNumber}
                onChangeProp={(text) => setClientNumber(text)}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVerifyVisible(!modalVerifyVisible)}
              >
                <ThemedText style={styles.textStyle}>
                  Enviar Verificação
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </Modal>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Perfil</ThemedText>
          <Button title="Logout" onPress={handleLogout} />
          <Button
            title="Verificar"
            onPress={() => setModalVerifyVisible(true)}
          />
        </ThemedView>
        <ThemedTextInput
          name="email"
          type="email-address"
          placeholderProp={email}
          textContentType="emailAddress"
          value={email}
          onChangeProp={(text) => onChangeInputEmail(text)}
        />
        <ThemedTextInput
          name="name"
          type="default"
          placeholderProp={name}
          textContentType="name"
          value={name}
          onChangeProp={(text) => onChangeInputName(text)}
        />
        <ThemedTextInput
          name="is_verify"
          type="default"
          placeholderProp={is_verify === 1 ? "Não Verificado" : "Verificado"}
          editable={false}
          textContentType="name"
          value={is_verify === 1 ? "Não Verificado" : "Verificado"}
        />
        <ThemedView style={styles.fixToText}>
          <Button title="Update Dados" onPress={updateUser} />
        </ThemedView>
      </ThemedView>
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    width: 400,
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
  label: {
    fontSize: 16,
  },
  fixToText: {
    gap: 15,
    flexDirection: "row",
    justifyContent: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});
