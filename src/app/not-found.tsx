import Link from 'next/link';
import './notFoundStyle.css';

export default function NotFound() {
  return (
    <div className="flex flex-col flex-center w-full h-dvh">
      <h1 className="text-9xl font-bold text-slate-50/50">
        <span className="notfound-animation">4</span>
        <span className="notfound-animation">0</span>
        <span className="notfound-animation">4</span>
      </h1>
      <p className="text-slate-300/70">페이지를 찾을 수 없습니다</p>
      <Link href="/" className="px-6 py-4 mt-4 rounded-2xl bg-slate-100/10 hover:!bg-slate-100/20 !text-slate-300/80">
        메인으로 돌아가기
      </Link>
    </div>
  );
}
