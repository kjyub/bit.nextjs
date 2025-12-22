import Link from 'next/link';
import './notFoundStyle.css';

export default function NotFound() {
  return (
    <div className="flex flex-col flex-center w-full h-dvh">
      <h1 className="text-9xl font-bold text-surface-main-text/50">
        <span className="notfound-animation">4</span>
        <span className="notfound-animation">0</span>
        <span className="notfound-animation">4</span>
      </h1>
      <p className="text-surface-main-text/70">페이지를 찾을 수 없습니다</p>
      <Link href="/" className="px-6 py-4 mt-4 rounded-2xl bg-surface-common-background hover:!bg-surface-common-background-active !text-surface-main-text/80">
        메인으로 돌아가기
      </Link>
    </div>
  );
}
