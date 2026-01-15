import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Home, Lock, User, Brain, Sparkles, Shield, Zap } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast.success("Chào mừng trở lại!", {
          description: "Đăng nhập thành công",
        });
        setLocation("/");
      } else {
        toast.error("Thất bại", {
          description: "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-950 dark:from-black dark:via-slate-950 dark:to-cyan-950">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-6 left-6 gap-2 z-50 bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 backdrop-blur-xl border border-white/20 text-white transition-all"
        onClick={() => setLocation("/")}
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Button>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md space-y-8 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">MLN111 Platform</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                Học tập thông minh
              </span>
              <br />
              <span className="text-white">
                với AI
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Nền tảng học tập hiện đại với công nghệ AI, Mind Map tương tác và bài tập thực hành thông minh.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4">
            {[
              { icon: Sparkles, text: "Mind Map tự động bằng AI" },
              { icon: Shield, text: "Bảo mật thông tin tuyệt đối" },
              { icon: Zap, text: "Học tập nhanh và hiệu quả" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 animate-in fade-in slide-in-from-left"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-200 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right duration-1000">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full mb-4">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">MLN111 Platform</span>
            </div>
          </div>

          {/* Login card */}
          <div className="bg-slate-900/40 dark:bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-10 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-white">
                Đăng nhập
              </h2>
              <p className="text-gray-400">
                Chào mừng bạn quay trở lại
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên đăng nhập
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder="Nhập username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-slate-800/50 dark:bg-black/50 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-xl transition-all pl-4 group-hover:border-cyan-600 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 bg-slate-800/50 dark:bg-black/50 border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 backdrop-blur-xl transition-all pl-4 group-hover:border-cyan-600 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 hover:from-cyan-700 hover:via-teal-700 hover:to-blue-800 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.02] border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Đăng nhập ngay
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
