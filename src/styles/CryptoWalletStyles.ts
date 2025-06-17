import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  flex flex-col max-md:w-full md:w-[768px] px-4 max-md:space-y-4 md:space-y-8
`;

export const WalletLayout = tw.div`
  flex flex-col w-full common-panel padding gap-6

  max-md:[&>.title]:text-xl md:[&>.title]:text-2xl [&>.title]:text-slate-200 [&>.title]:font-bold [&>.title]:leading-[100%]
`;

export const WalletBox = tw.div`
  flex flex-col w-full h-full space-y-2
  rounded-xl

  [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:w-full
  [&>.header>.title]:space-x-2
  max-sm:[&>.header>.title]:text-lg sm:[&>.header>.title]:text-xl [&>.header>.title]:text-slate-300 [&>.header>.title]:font-medium
  [&>.content]:flex [&>.content]:justify-between [&>.content]:items-center [&>.content]:w-full
  [&>.content>.label]:text-sm [&>.content>.label]:text-slate-300/70
  [&>.content>.value]:text-base [&>.content>.value]:text-slate-100
`;

export const TransferTypeBox = tw.div`
  relative
  flex items-center w-full h-12
  text-sm

  *:duration-300
  [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
  [&>button]:text-slate-400 [&>button.active]:text-slate-100

  [&>.thumb]:absolute [&>.thumb]:z-10 [&>.thumb]:top-0 [&>.thumb]:left-0 [&>.thumb.right]:left-1/2
  [&>.thumb]:w-1/2 [&>.thumb]:h-full
  [&>.thumb]:rounded-full [&>.thumb]:bg-indigo-600

  [&>.bg]:w-full [&>.bg]:h-full
  [&>.bg]:rounded-full [&>.bg]:bg-transparent
  mouse:hover:[&>.bg]:bg-slate-700/50
  mouse:hover:[&>.bg]:w-[calc(100%+0.5rem)] mouse:hover:[&>.bg]:h-[calc(100%+0.5rem)]
  active:[&>.bg]:bg-slate-700/50
  active:[&>.bg]:w-[calc(100%+0.5rem)] active:[&>.bg]:h-[calc(100%+0.5rem)]
`;

export const TransferInfoList = tw.div`
  flex flex-col w-full space-y-1
`;
export const TransferInfoBox = tw.div`
  flex justify-between items-center w-full

  [&>.label]:text-sm [&>.label]:text-slate-300/70
  [&>.value]:text-base [&>.value]:text-slate-300
`;
export const TransferButton = tw.button`
  max-sm:w-full sm:w-48 h-11 mx-auto
  rounded-lg bg-indigo-600/80 hover:bg-indigo-600/90
  disabled:bg-slate-500/50 disabled:cursor-not-allowed
  text-base text-slate-200
  transition-colors
`;
