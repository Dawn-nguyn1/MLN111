/* @refresh reset */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";

// 1. Định nghĩa kiểu dữ liệu User
export type UserRole = "admin" | "user";

interface User {
  username: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

// 2. Danh sách tài khoản "cứng" (1 Admin, 5 Users)
const MOCK_ACCOUNTS = [
  { username: "admin", pass: "admin123", name: "Quản trị viên", role: "admin" },
  { username: "user1", pass: "123456", name: "Nguyễn Văn A", role: "user" },
  { username: "user2", pass: "123456", name: "Trần Thị B", role: "user" },
  { username: "user3", pass: "123456", name: "Lê Văn C", role: "user" },
  { username: "user4", pass: "123456", name: "Phạm Thị D", role: "user" },
  { username: "user5", pass: "123456", name: "Hoàng Văn E", role: "user" },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();

  // (Tùy chọn) Kiểm tra localStorage khi tải trang để giữ đăng nhập
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, pass: string) => {
    const account = MOCK_ACCOUNTS.find(
      (acc) => acc.username === username && acc.pass === pass
    );

    if (account) {
      const userData: User = {
        username: account.username,
        name: account.name,
        role: account.role as UserRole,
      };
      setUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    setLocation("/login"); // Chuyển hướng về trang login sau khi đăng xuất
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
