import { cn } from '@/utils/StyleUtils';

export default function Hammer({
  state,
  onClick,
}: {
  state: number;
  onClick: () => void;
}) {
  const deg = -45 * (state / 100);

  return (
    <div className={cn(['@container relative flex justify-end items-end size-full cursor-pointer'])} onClick={onClick}>
      <div
        className="absolute flex justify-end w-[300%] h-1/5 transition-transform duration-100 will-change-transform translate-x-[-34cqw]" // 아이콘의 32cqw에 의한 값
        style={{ transform: `rotate(${deg}deg)` }}
      >
        <i className="fa-solid fa-hammer rotate-45 text-[32cqw]" />
      </div>
    </div>
  );
}
