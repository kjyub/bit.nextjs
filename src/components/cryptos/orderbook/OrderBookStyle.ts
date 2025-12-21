import tw from 'tailwind-styled-components';

export const Row = tw.button`
  flex items-center w-full
  text-left

  max-sm:[&_.trade-price]:w-[calc(100%-50px)] sm:[&_.trade-price]:w-[calc(100%-100px)]
  [&_.price]:w-[50px] [&_.price]:text-right
  [&_.size]:w-[50px] [&_.size]:text-right

  touch:select-none
`;
