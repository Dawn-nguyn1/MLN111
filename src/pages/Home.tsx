import Nav from "./home/Nav";
import Hero from "./home/Hero";
import About from "./home/About";
import Revolutions from "./home/Revolutions";
import Models from "./home/Models";
import Vietnam from "./home/Vietnam";
import CTA from "./home/CTA";
import Footer from "./home/Footer";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const { user } = useAuth();

  const handleResetCounter = async () => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      await setDoc(doc(db, 'settings', 'visitor-counter'), { count: 0 });
      toast.success("✅ Đã reset lượt truy cập về 0!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Lỗi khi reset counter!");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />
      {user?.role === "admin" && (
        <Button
          onClick={handleResetCounter}
          className="fixed top-20 right-4 z-[9999] gap-2"
          variant="destructive"
          size="sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Counter
        </Button>
      )}
      <Hero />
      <About />
      <Revolutions />
      <Models />
      <Vietnam />
      <CTA />
      <Footer />
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 1s ease-out;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 1s ease-out;
        }

        .animate-fade-in-right {
          animation: fadeInRight 1s ease-out;
        }
      `}</style>
    </div>
  );
}
