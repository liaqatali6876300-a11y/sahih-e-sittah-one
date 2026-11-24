import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="urdu-text inline-flex items-center gap-2 px-3.5 h-10 rounded-lg bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d] transition-colors text-sm font-semibold whitespace-nowrap shrink-0"
      >
        <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>ایپ انسٹال کریں</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="urdu-text inline-flex items-center gap-2 px-3.5 h-10 rounded-lg bg-emerald-800 dark:bg-[#D4AF37] text-white dark:text-[#07130E] hover:bg-emerald-900 dark:hover:bg-[#e0be4d] transition-colors text-sm font-semibold whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>ایپ انسٹال کریں</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#0D1F18] border border-stone-200 dark:border-emerald-900/70 p-6 shadow-xl text-right">
              <h3 className="urdu-text text-xl font-bold text-stone-900 dark:text-stone-100">
                فون میں ایپ انسٹال کرنے کا طریقہ
              </h3>
              <p className="urdu-text mt-3 text-base text-stone-600 dark:text-stone-300 leading-loose">
                ۱۔ براؤزر کے نیچے یا اوپر موجود «شیئر» کا بٹن دبائیں۔
                <br />
                ۲۔ فہرست میں «ہوم اسکرین میں شامل کریں» پر کلک کریں۔
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="urdu-text mt-5 w-full rounded-lg bg-emerald-800 dark:bg-[#D4AF37] py-2.5 text-sm font-semibold text-white dark:text-[#07130E] hover:bg-emerald-900 transition-colors"
              >
                بند کریں
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
