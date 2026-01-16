import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

const STORAGE_KEY = 'mln111-visitor-count';

// Export hàm để tăng counter từ bên ngoài (dùng khi login)
// eslint-disable-next-line react-refresh/only-export-components
export const incrementVisitorCount = () => {
  const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  const newCount = currentCount + 1;
  localStorage.setItem(STORAGE_KEY, newCount.toString());
  
  // Dispatch event cho tab hiện tại
  window.dispatchEvent(new Event('visitor-count-updated'));
  
  return newCount;
};

const VisitorCounter = () => {
  const [count, setCount] = useState<number>(0);
  const hasIncremented = useRef(false);
  const [location] = useLocation();

  // Hàm đọc dữ liệu từ localStorage
  const updateCountFromStorage = () => {
    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    setCount(currentCount);
  };

  useEffect(() => {
    // 1. Xử lý tăng đếm khi mới vào (chỉ chạy 1 lần)
    if (!hasIncremented.current) {
      hasIncremented.current = true;
      
      const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      const newCount = currentCount + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      setCount(newCount);

      // Thử cập nhật từ API (fallback)
      fetch('https://api.countapi.xyz/hit/mln111-web-counter/visits')
        .then((response) => response.json())
        .then((data) => {
          if (data.value) {
            setCount(data.value);
            localStorage.setItem(STORAGE_KEY, data.value.toString());
          }
        })
        .catch((error) => {
          console.log('Sử dụng bộ đếm local:', error.message);
        });
    } else {
      // Nếu đã mount rồi thì chỉ cần lấy số hiện tại
      updateCountFromStorage();
    }
  }, []);

  // Lắng nghe sự kiện để đồng bộ giữa các tab
  useEffect(() => {
    // Xử lý sự kiện từ tab khác (Storage Event)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        updateCountFromStorage();
      }
    };

    // Xử lý sự kiện trong cùng tab (Custom Event)
    const handleLocalUpdate = () => {
      updateCountFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('visitor-count-updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visitor-count-updated', handleLocalUpdate);
    };
  }, []);

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
      <span className="font-semibold">Lượt truy cập: {count.toLocaleString()}</span>
    </div>
  );
};

export default VisitorCounter;
