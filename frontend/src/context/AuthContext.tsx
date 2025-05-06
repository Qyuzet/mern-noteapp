import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    token: string;
    role?: string;
    isVerified?: boolean;
  } | null;
  login: (userData: {
    name: string;
    email: string;
    token: string;
    role?: string;
    isVerified?: boolean;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    token: string;
    role?: string;
    isVerified?: boolean;
  } | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    const isVerified = localStorage.getItem("userVerified");

    if (token && name && email) {
      setUser({
        name,
        email,
        token,
        role: role || "user",
        isVerified: isVerified === "true",
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: {
    name: string;
    email: string;
    token: string;
    role?: string;
    isVerified?: boolean;
  }) => {
    console.log("Login userData:", userData); // Debug log

    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);

    if (userData.role) {
      localStorage.setItem("userRole", userData.role);
    }

    if (userData.isVerified !== undefined) {
      localStorage.setItem("userVerified", userData.isVerified.toString());
    }

    setUser(userData);
    setIsAuthenticated(true);

    console.log("User after login:", userData); // Debug log
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userVerified");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
