import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

// Export hàm để tăng counter từ bên ngoài (dùng khi login)
export const incrementVisitorCount = () => {
  const storageKey = 'mln111-visitor-count';
  const currentCount = parseInt(localStorage.getItem(storageKey) || '1000', 10);
  const newCount = currentCount + 1;
  localStorage.setItem(storageKey, newCount.toString());
  
  // Dispatch event để component cập nhật
  window.dispatchEvent(new Event('visitor-count-updated'));
  
  return newCount;
};

const VisitorCounter = () => {
  const [count, setCount] = useState<number>(0);
  const hasIncremented = useRef(false);
  const [location] = useLocation();

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    const storageKey = 'mln111-visitor-count';
    
    // Tăng số đếm mỗi lần reload
    const currentCount = parseInt(localStorage.getItem(storageKey) || '1000', 10);
    const newCount = currentCount + 1;
    localStorage.setItem(storageKey, newCount.toString());
    setCount(newCount);

    // Thử cập nhật từ API
    fetch('https://api.countapi.xyz/hit/mln111-web-counter/visits')
      .then((response) => response.json())
      .then((data) => {
        if (data.value) {
          setCount(data.value);
          localStorage.setItem(storageKey, data.value.toString());
        }
      })
      .catch((error) => {
        console.log('Sử dụng bộ đếm local:', error.message);
      });
  }, []);

  // Lắng nghe sự kiện cập nhật từ login
  useEffect(() => {
    const handleUpdate = () => {
      const storageKey = 'mln111-visitor-count';
      const currentCount = parseInt(localStorage.getItem(storageKey) || '1000', 10);
      setCount(currentCount);
    };

    window.addEventListener('visitor-count-updated', handleUpdate);
    return () => window.removeEventListener('visitor-count-updated', handleUpdate);
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
