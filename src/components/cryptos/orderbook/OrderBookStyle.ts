import tw from 'tailwind-styled-components';

export const Row = tw.div`
  flex items-center w-full

  max-sm:[&_.trade-price]:w-[calc(100%-50px)] sm:[&_.trade-price]:w-[calc(100%-100px)]
  [&_.price]:w-[50px]
  [&_.size]:w-[50px]
`;
