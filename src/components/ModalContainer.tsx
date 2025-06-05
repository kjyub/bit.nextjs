import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import Modal from 'react-modal';
import tw from 'tailwind-styled-components';

const Background = tw.div`
    flex flex-center w-full h-full
`;

export interface IModalContainer {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isBlur?: boolean;
  isCloseByBackground?: boolean;
  isCloseButtonShow?: boolean;
  children: React.ReactNode;
}
const ModalContainer = ({
  isOpen,
  setIsOpen,
  isBlur = true,
  isCloseByBackground = true,
  isCloseButtonShow = false,
  children,
}: IModalContainer) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (isCloseByBackground) {
      setIsOpen(false);
    }
  };

  const handleStopPropagation = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    // <></>
    <Modal
      isOpen={isOpen}
      ariaHideApp={false}
      onRequestClose={() => {
        setIsOpen(false);
      }}
      style={{ overlay: { backgroundColor: 'transparent', zIndex: 500 } }}
      className={`flex flex-center w-screen h-screen bg-black/20 dark:bg-black/30 outline-hidden ${
        isBlur && 'backdrop-blur-xs'
      }`}
    >
      <Background onClick={handleClick}>
        {/* {children && children} */}
        <div className="relative flex flex-center" onClick={handleStopPropagation}>
          {(!isCloseByBackground || isCloseButtonShow) && (
            <i
              className="absolute z-10 top-5 right-6 fa-solid fa-xmark text-lg text-slate-400 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          )}
          {children && children}
        </div>
      </Background>
    </Modal>
  );
};

export default ModalContainer;
