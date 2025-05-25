import React from "react";

interface IInfoModal {
  title?: string;
  content?: string | React.ReactNode;
  width?: string;
}
export default function InfoModal({ title, content, width = "max-sm:w-[90vw] sm:w-72" }: IInfoModal) {
  return (
    // tailwind 변수 테스트
    <div className={`flex flex-col ${width} w- p-4 space-y-4 rounded-lg bg-slate-50 dark:bg-slate-600`}>
      {title && <span className="text-xl font-medium text-slate-700 dark:text-slate-200">{title}</span>}
      <div className="w-full text-sm text-slate-600 dark:text-slate-300">{content}</div>
    </div>
  );
}
