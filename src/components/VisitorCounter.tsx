import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { doc, getDoc, setDoc, onSnapshot, increment, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const COUNTER_DOC_ID = 'visitor-counter';

// Export hàm để tăng counter từ bên ngoài (dùng khi login)
// eslint-disable-next-line react-refresh/only-export-components
export const incrementVisitorCount = async () => {
  try {
    const counterRef = doc(db, 'settings', COUNTER_DOC_ID);
    const docSnap = await getDoc(counterRef);
    
    if (!docSnap.exists()) {
      // Nếu chưa có, tạo mới
      await setDoc(counterRef, { count: 1 });
    } else {
      // Nếu có rồi, tăng lên
      await updateDoc(counterRef, { count: increment(1) });
    }
    console.log("✅ Tăng visitor count trên Firebase");
  } catch (error) {
    console.error("❌ Lỗi khi tăng counter:", error);
  }
};

const VisitorCounter = () => {
  const [count, setCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasIncremented = useRef(false);
  const [location] = useLocation();

  console.log("🎨 VisitorCounter render, count:", count, "isLoaded:", isLoaded);

  // Kết nối Firebase Realtime để lắng nghe visitor count
  useEffect(() => {
    const counterRef = doc(db, 'settings', COUNTER_DOC_ID);

    // Khởi tạo hoặc tăng count (chỉ 1 lần)
    const initCounter = async () => {
      if (hasIncremented.current) return;
      hasIncremented.current = true;

      try {
        const docSnap = await getDoc(counterRef);
        
        if (!docSnap.exists()) {
          // Tạo mới với count = 1
          await setDoc(counterRef, { count: 1 });
          console.log("🔧 Khởi tạo counter = 1");
        } else {
          // Tăng count hiện tại
          await updateDoc(counterRef, { count: increment(1) });
          console.log("✅ Tăng visitor count +1");
        }
      } catch (error) {
        console.error("❌ Lỗi khởi tạo counter:", error);
      }
    };

    initCounter();

    // Lắng nghe realtime changes
    const unsubscribe = onSnapshot(counterRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const newCount = data?.count || 0;
        console.log("📊 Firebase count:", newCount);
        setCount(newCount);
        setIsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Ẩn counter ở trang login
  if (location === '/login') {
    return null;
  }

  // Ẩn counter ở trang login
  if (location === '/login') {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 rounded-full bg-black/90 px-4 py-2 text-sm text-white backdrop-blur-md shadow-2xl border border-white/20 transition-all hover:scale-105"
      style={{ pointerEvents: 'auto' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span className="font-semibold">
        Lượt truy cập: {isLoaded ? count.toLocaleString() : "..."}
      </span>
    </div>
  );
};

export default VisitorCounter;
