import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { Storage } from "../hooks/storage"; // Importe o Storage

// 🔹 Definição dos campos do User/Client
interface User {
  id: number;
  name: string;
  is_verify: number;
  email: string;
}

// 🔹 Tipos do contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar user guardado
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUserData = Storage.getItem("userData");
        if (storedUserData) {
          storedUserData.then((data) => setUser(JSON.parse(data ?? "")));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Armazenar user
    Storage.setItem("userData", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Limpar dados armazenados
    Storage.removeItem("userData");
    Storage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
