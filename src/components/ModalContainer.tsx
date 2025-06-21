import type { StyleProps } from '@/types/StyleTypes';
import { cn } from '@/utils/StyleUtils';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import tw from 'tailwind-styled-components';

const Dimmer = tw.div<StyleProps>`
  absolute inset-0 z-0
  flex flex-center bg-black/20 w-screen h-dvh
  ${({ $is_active }) => !$is_active && 'opacity-0'}
  transition-all duration-200
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

const Wrapper = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
  return (
    <div className="relative flex flex-center">
      <div
        className={cn([
          'z-10 transition-all duration-200 will-change-transform [&>div]:backdrop-blur-none',
          { 'opacity-0 scale-97': !isOpen },
          { 'opacity-100 scale-100': isOpen },
        ])}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      {isOpen && <div className="absolute z-0 w-[100%] h-[100%] backdrop-blur-xl rounded-xl"></div>}
    </div>
  );
};

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEscClose?: boolean;
  children: React.ReactNode;
}
export default function ModalContainer({ isOpen, setIsOpen, isEscClose = true, children }: Props) {
  useEffect(() => {
    if (isEscClose) {
      const handleEscClose = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        window.addEventListener('keydown', handleEscClose);
      } else {
        window.removeEventListener('keydown', handleEscClose);
      }
    }
  }, [isOpen, isEscClose, setIsOpen]);

  return (
    <Layout>
      <div 
        className={cn([
          'fixed inset-0 z-100 flex flex-center w-screen h-dvh',
          { 'pointer-events-none': !isOpen },
        ])}
      >
        <Dimmer onClick={() => setIsOpen(false)} $is_active={isOpen} />
        <Wrapper isOpen={isOpen}>
          {children}
        </Wrapper>
      </div>
    </Layout>
  );
}