import React from "react";
import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  KeyboardType,
  View,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  name: string;
  lightColor?: string;
  darkColor?: string;
  placeholderProp?: string | number;
  type?: KeyboardType;
  onChangeProp?: ((text: string | number) => void) | undefined;
  valueProp?: string | number | undefined;
  secure?: boolean;
  rightIcon?: string;
  handlePasswordVisibility?: () => void;
};
/**
 * Input de texto com tema adaptável, original que vem com a inicializaçao do projecto,
 * mas foi alterado para puder ser mais facil a utilização para password text input.
 *
 */
export function ThemedTextInput({
  name,
  style,
  lightColor,
  darkColor,
  type = "default",
  secure = false,
  placeholderProp,
  onChangeProp,
  valueProp,
  rightIcon,
  handlePasswordVisibility,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            name={name}
            style={styles.inputField}
            placeholder={placeholderProp}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            secureTextEntry={secure}
            value={valueProp}
            enablesReturnKeyAutomatically
            onChangeText={onChangeProp}
          />
          <Pressable onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={22}
              color="#232323"
            />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EEDC",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#d7d7d7",
  },
  inputField: {
    backgroundColor: "#ffffff",
    padding: 14,
    fontSize: 22,
    width: "90%",
  },
});
