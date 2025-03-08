import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * Função para guardar, pegar, remover dados no AsyncStorage.
 *
 * @returns key        - Chave em que vai ser guardado
 * @returns value      - Valor que vai ser guardado(neste caso o user)
 */
export const Storage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Erro ao armazenar ${key}:`, error);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
    }
  },
};
