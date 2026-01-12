import { Sun, Moon, Sparkles, LogOut } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

export default function Nav() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [_, setLocation] = useLocation();

    return (
        <nav
            className={`fixed top-0 w-full z-50 backdrop-blur-sm transition-colors duration-300 ${theme === "dark"
                ? "bg-gradient-to-b from-slate-900 to-transparent"
                : "bg-gradient-to-b from-white/80 to-transparent border-b border-slate-200/30"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div 
                    className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
                    onClick={() => setLocation("/")}
                >
                    Giai Cấp Và Dân Tộc
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex gap-6">
                        <a
                            href="#about"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Giai Cấp
                        </a>
                        <a
                            href="#revolutions"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Cộng Đồng
                        </a>
                        <a
                            href="#models"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Mối Quan Hệ
                        </a>
                        <a
                            href="#vietnam"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Tóm Tắt
                        </a>
                        <Link
                            href="/concept-example"
                            className={`flex items-center gap-1 transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            <Sparkles className="w-4 h-4" />
                            Ví Dụ Khái Niệm
                        </Link>
                        <Link
                            href="/giai-cap-mindmap"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            MindMap
                        </Link>
                        <Link
                            href="/practice"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Practice
                        </Link>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className={`hidden sm:block text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                                Xin chào, <strong>{user.name}</strong>
                            </span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={logout}
                                title="Đăng xuất"
                                className={theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button variant="outline" size="sm">
                                Đăng nhập
                            </Button>
                        </Link>
                    )}

                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-colors ${theme === "dark"
                            ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
