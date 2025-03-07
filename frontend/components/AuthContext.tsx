import React, { createContext, useState, useContext, ReactNode } from "react";

// 🔹 Definição do tipo de usuário
interface User {
  id: number;
  name: string;
  is_verift: number;
}

// 🔹 Tipos do contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
