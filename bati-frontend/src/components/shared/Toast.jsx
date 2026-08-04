import { useEffect } from "react";

const Toast = ({ type = "info", message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: "✅",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: "❌",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
      icon: "⚠️",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: "ℹ️",
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div className="fixed bottom-6 right-6 z-100 animate-slide-up">
      <div
        className={`flex items-start gap-3 px-5 py-4 rounded-xl border shadow-lg max-w-sm ${style.bg}`}
      >
        <span className="text-lg shrink-0">{style.icon}</span>
        <p className={`text-sm font-medium flex-1 ${style.text}`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`shrink-0 text-lg leading-none opacity-60 hover:opacity-100 ${style.text}`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
