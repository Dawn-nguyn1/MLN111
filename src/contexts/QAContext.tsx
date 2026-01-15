import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
  const [questions, setQuestions] = useState<Question[]>([]);

  // 1. Load dữ liệu từ localStorage khi khởi chạy
  useEffect(() => {
    const storedData = localStorage.getItem("app_questions");
    if (storedData) {
      setQuestions(JSON.parse(storedData));
    }
  }, []);

  // 2. Lưu dữ liệu mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("app_questions", JSON.stringify(questions));
  }, [questions]);

  // Hàm gửi câu hỏi (Dành cho User)
  const sendQuestion = (userId: string, username: string, content: string) => {
    const newQ: Question = {
      id: Date.now().toString(), // Tạo ID đơn giản
      userId,
      username,
      content,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    // Thêm câu hỏi mới lên đầu danh sách
    setQuestions((prev) => [newQ, ...prev]);
  };

  // Hàm trả lời (Dành cho Admin)
  const replyQuestion = (questionId: string, adminName: string, answerContent: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              status: "replied",
              answer: answerContent,
              adminName: adminName,
              replyTimestamp: new Date().toISOString(),
            }
          : q
      )
    );
  };

  // Hàm xóa (Tùy chọn)
  const deleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter(q => q.id !== questionId));
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
