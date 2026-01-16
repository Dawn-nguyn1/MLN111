import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";

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
  sendQuestion: (userId: string, username: string, content: string) => Promise<void>;
  replyQuestion: (questionId: string, adminName: string, answerContent: string) => Promise<void>;
  deleteQuestion: (questionId: string) => Promise<void>;
}

const QAContext = createContext<QAContextType | undefined>(undefined);

export function QAProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);

  // KẾT NỐI REALTIME VỚI FIREBASE
  useEffect(() => {
    console.log("🔥 Kết nối Firebase Realtime...");
    
    // Tạo query: Lấy collection "questions" và sắp xếp theo timestamp giảm dần
    const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));

    // onSnapshot: Lắng nghe sự thay đổi realtime
    // Mỗi khi dữ liệu trên Cloud thay đổi, hàm này tự động chạy
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedQuestions = snapshot.docs.map((doc) => ({
          id: doc.id, // ID thực từ Firebase
          ...doc.data(),
        })) as Question[];
        
        console.log("📥 Nhận được", fetchedQuestions.length, "câu hỏi từ Cloud");
        setQuestions(fetchedQuestions);
      },
      (error) => {
        console.error("❌ Lỗi Firebase:", error);
      }
    );

    // Cleanup: Hủy lắng nghe khi component unmount
    return () => {
      console.log("🛑 Ngắt kết nối Firebase");
      unsubscribe();
    };
  }, []);

  // 1. Gửi câu hỏi (Lưu lên Cloud)
  const sendQuestion = async (userId: string, username: string, content: string) => {
    try {
      console.log("📤 Đang gửi câu hỏi lên Cloud...");
      await addDoc(collection(db, "questions"), {
        userId,
        username,
        content,
        timestamp: Timestamp.now().toDate().toISOString(),
        status: "pending",
      });
      console.log("✅ Đã gửi lên Firebase thành công!");
    } catch (e) {
      console.error("❌ Lỗi khi gửi câu hỏi:", e);
      throw e;
    }
  };

  // 2. Trả lời (Cập nhật lên Cloud)
  const replyQuestion = async (questionId: string, adminName: string, answerContent: string) => {
    try {
      console.log("💬 Đang gửi câu trả lời lên Cloud...");
      const questionRef = doc(db, "questions", questionId);
      await updateDoc(questionRef, {
        status: "replied",
        answer: answerContent,
        adminName: adminName,
        replyTimestamp: Timestamp.now().toDate().toISOString(),
      });
      console.log("✅ Đã trả lời thành công!");
    } catch (e) {
      console.error("❌ Lỗi khi trả lời:", e);
      throw e;
    }
  };

  // 3. Xóa câu hỏi (Xóa trên Cloud)
  const deleteQuestion = async (questionId: string) => {
    try {
      console.log("🗑️ Đang xóa câu hỏi...");
      await deleteDoc(doc(db, "questions", questionId));
      console.log("✅ Đã xóa thành công!");
    } catch (e) {
      console.error("❌ Lỗi khi xóa:", e);
      throw e;
    }
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
