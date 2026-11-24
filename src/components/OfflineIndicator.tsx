import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="urdu-text fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-900 dark:bg-[#132E24] border border-[#D4AF37]/50 px-4 py-2 text-sm font-semibold text-white shadow-lg"
    >
      <WifiOff className="w-4 h-4 text-[#D4AF37] shrink-0" aria-hidden="true" />
      <span>آف لائن موڈ — محفوظ شدہ احادیث دستیاب ہیں</span>
    </div>
  );
};
