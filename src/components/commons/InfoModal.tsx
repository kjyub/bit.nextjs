import type React from 'react';

interface IInfoModal {
  title?: string;
  content?: string | React.ReactNode;
  width?: string;
}
export default function InfoModal({ title, content, width = 'max-sm:w-[90vw] sm:w-96' }: IInfoModal) {
  return (
    // tailwind 변수 테스트
    <div
      className={`flex flex-col ${width} max-h-[80dvh] p-8 space-y-4 rounded-xl bg-slate-700/70 backdrop-blur-4xl overflow-y-auto scroll-transparent`}
    >
      {title && <span className="text-xl font-medium text-slate-700 dark:text-slate-200">{title}</span>}
      <div className="w-full text-sm text-slate-600 dark:text-slate-300">{content}</div>
    </div>
  );
}
