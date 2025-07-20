import { cn } from '@/utils/StyleUtils';
import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import './stack-filpper.css';

const StackFilpperContext = createContext<{
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}>({
  currentIndex: 0,
  setCurrentIndex: () => undefined,
});

/**
 * 스택 플리퍼 컴포넌트
 *
 * 자식 컴포넌트를 스택 형태로 플리퍼 효과를 줍니다.
 *
 * @param defaultIndex 기본 인덱스
 * @param className 추가 클래스명 (사이즈 속성 필수)
 * @param children 자식 컴포넌트
 */
function Wrapper({
  defaultIndex = 0,
  className,
  children,
}: { defaultIndex?: number; className: string; children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  return (
    <StackFilpperContext.Provider value={{ currentIndex, setCurrentIndex }}>
      <div className={cn(['relative flex flex-center', className])}>{children}</div>
    </StackFilpperContext.Provider>
  );
}

/**
 * 스택 플리퍼 아이템 컴포넌트
 *
 * 자식 컴포넌트를 스택 형태로 플리퍼 효과를 줍니다.
 *
 * @param index 인덱스
 * @param children 자식 컴포넌트
 */
function Item({ index, children }: { index: number; children: React.ReactNode }) {
  const { currentIndex, setCurrentIndex } = useContext(StackFilpperContext);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (currentIndex === index) return;

      e.stopPropagation();
      e.preventDefault();

      setCurrentIndex(index);
    },
    [currentIndex, index, setCurrentIndex],
  );

  return (
    <div className={`item ${currentIndex === index ? 'active' : 'inactive'}`} onClick={handleClick}>
      {children}
    </div>
  );
}

export default { Wrapper, Item };
