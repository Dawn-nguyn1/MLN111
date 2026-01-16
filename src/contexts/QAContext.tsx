import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Định nghĩa kiểu dữ liệu cho câu hỏi
export interface Question {
  id: string;
  userId: string;
  username: string; // Tên người hỏi
  content: string;
  timestamp: string;
  status: "pending" | "replied";
  answer?: string; // Câu trả lời của admin
  adminName?: string; // Tên admin trả lời
  replyTimestamp?: string;
}

interface QAContextType {
  questions: Question[];
  sendQuestion: (userId: string, username: string, content: string) => void;
  replyQuestion: (questionId: string, adminName: string, answerContent: string) => void;
  deleteQuestion: (questionId: string) => void;
}

const QAContext = createContext<QAContextType | undefined>(undefined);

export function QAProvider({ children }: { children: ReactNode }) {
  console.log("🎬 QAProvider RENDER - Component đang chạy!");
  
  const [questions, setQuestions] = useState<Question[]>(() => {
    console.log("🔧 useState init - Đọc localStorage lần đầu");
    try {
      const stored = localStorage.getItem("app_questions");
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("✅ Init: Tìm thấy", parsed.length, "câu hỏi");
        return parsed;
      }
    } catch (e) {
      console.error("❌ Init error:", e);
    }
    console.log("ℹ️ Init: Không có data, trả về []");
    return [];
  });

  // Hàm đọc dữ liệu từ LocalStorage
  const loadFromStorage = () => {
    try {
      const storedData = localStorage.getItem("app_questions");
      console.log("🔍 Loading from storage:", storedData);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Cập nhật state với dữ liệu mới
        setQuestions(parsedData);
        console.log("📥 Đã load câu hỏi:", parsedData.length, parsedData);
      } else {
        console.log("❌ Không có dữ liệu trong localStorage");
      }
    } catch (error) {
      console.error("❌ Lỗi đọc dữ liệu:", error);
    }
  };

  // 1. Khởi chạy và thiết lập đồng bộ
  useEffect(() => {
    console.log("🚀 QAContext mounted - Bắt đầu setup");
    
    // Load ngay lần đầu
    loadFromStorage();

    // CÁCH 1: Lắng nghe sự kiện storage (Khi tab khác sửa dữ liệu)
    const handleStorageChange = (event: StorageEvent) => {
      console.log("🔔 Storage event detected!", event.key, event.newValue);
      if (event.key === "app_questions") {
        console.log("✅ Phát hiện thay đổi từ tab khác!");
        loadFromStorage();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // CÁCH 2: "Quét" dữ liệu mỗi 2 giây (Dự phòng trường hợp Cách 1 không chạy)
    const intervalId = setInterval(() => {
      console.log("⏰ Polling check...");
      loadFromStorage();
    }, 2000);

    return () => {
      console.log("🛑 QAContext unmounting");
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Helper để lưu dữ liệu
  const saveToStorage = (newQuestions: Question[]) => {
    const jsonData = JSON.stringify(newQuestions);
    localStorage.setItem("app_questions", jsonData);
    console.log("💾 Saved to localStorage:", newQuestions.length, "questions");
    console.log("📦 Data:", jsonData);
  };

  // Hàm gửi câu hỏi (Dành cho User)
  const sendQuestion = (userId: string, username: string, content: string) => {
    const newQ: Question = {
      id: Date.now().toString(),
      userId,
      username,
      content,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    
    setQuestions((prev) => {
      const updated = [newQ, ...prev];
      saveToStorage(updated);
      console.log("📤 Đã gửi câu hỏi:", newQ.content);
      return updated;
    });
  };

  // Hàm trả lời (Dành cho Admin)
  const replyQuestion = (questionId: string, adminName: string, answerContent: string) => {
    setQuestions((prev) => {
      const updated = prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: "replied" as const, // Fix type assertion
              answer: answerContent,
              adminName: adminName,
              replyTimestamp: new Date().toISOString(),
            }
          : q
      );
      saveToStorage(updated);
      return updated;
    });
  };

  // Hàm xóa
  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => {
        const updated = prev.filter(q => q.id !== questionId);
        saveToStorage(updated);
        return updated;
    });
  };

  return (
    <QAContext.Provider value={{ questions, sendQuestion, replyQuestion, deleteQuestion }}>
      {children}
    </QAContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQA() {
  const context = useContext(QAContext);
  if (!context) {
    throw new Error("useQA must be used within a QAProvider");
  }
  return context;
}
