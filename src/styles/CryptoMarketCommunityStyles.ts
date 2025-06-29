import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  flex flex-col w-full space-y-5
  pb-[360px]

  [&>.title]:flex [&>.title]:justify-between [&>.title]:items-center [&>.title]:w-full [&>.title]:px-1
  [&>.title]:text-2xl [&>.title]:text-slate-100 [&.title]:font-semibold
  [&>.title>_i]:mr-2 [&>.title>_i]:text-lg
`;

export const ListLayout = tw.div`
  flex flex-col w-full space-y-5

  [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:w-full
  [&>.header]:gap-2

  [&>.list]:flex [&>.list]:flex-col [&>.list]:w-full
  [&>.list]:divide-y [&>.list]:divide-slate-500/30

  [&>.control]:flex [&>.control]:justify-between [&>.control]:items-center [&>.control]:w-full
  [&>.control>button]:px-4 [&>.control>button]:h-10
  [&>.control>button]:rounded-full 
  [&>.control>button]:bg-slate-500/20 [&>.control>button]:hover:bg-slate-500/30
  [&>.control>button]:text-sm [&>.control>button]:text-slate-300
  [&>.control>button]:active:animate-pulse
  [&>.control>button]:transition-colors
  [&>.control>button>i]:mr-2 [&>.control>button>i]:text-[11px]
`;

export const SaveButton = tw.button`
  px-5 h-9
  rounded-full bg-blue-500/40 hover:bg-blue-500/50
  text-sm text-white
  transition-colors
`;

export const ItemLayout = tw.div`
  ${({ $is_deleted }: StyleProps) => ($is_deleted ? 'hidden' : 'flex')}
  flex-col items-center w-full px-1 py-2 space-y-2

`;
export const ItemRow = tw.div<StyleProps>`
  flex flex-col w-full px-3 py-2 space-y-2
  rounded-lg mouse:hover:bg-slate-700/30 active:bg-slate-700/30
  transition-colors cursor-pointer
  ${({ $is_active }: StyleProps) => ($is_active ? 'ring-1 ring-blue-500' : '')}

  [&>.row]:flex [&>.row]:justify-between [&>.row]:items-center [&>.row]:w-full
  [&>.row>.infos]:flex [&>.row>.infos]:items-center [&>.row>.infos]:space-x-2
  [&>.row>.infos>.info]:flex [&>.row>.infos>.info]:items-center [&>.row>.infos>.info]:space-x-1
  [&>.row>.infos>.info]:text-slate-400
  [&>.row>.infos>.info>i]:text-xs max-md:[&>.row>.infos>.info>span]:text-xs md:[&>.row>.infos>.info>span]:text-sm
`;
export const ItemViewBox = tw.div`
  flex flex-col items-center w-full p-3 max-md:px-1 pb-16 space-y-5
  border-t border-slate-500/20
`;
export const ItemViewLikeBox = tw.div`
  flex items-center space-x-2

  max-md:[&>button]:px-3.5 md:[&>button]:px-4 max-md:[&>button]:h-7.5 md:[&>button]:h-8 [&>button]:space-x-2
  [&>button]:rounded-full [&>button]:bg-slate-600/50 [&>button]:hover:bg-slate-500/50
  max-md:[&>button]:text-xs md:[&>button]:text-sm [&>button]:text-slate-300
  [&>button]:duration-200
  [&>button>i]:text-xs
  [&>button.like>i]:text-red-500 [&>button.dislike>i]:text-blue-500
  [&>button.active]:ring-1 [&>button.active]:ring-slate-200
`;
export const ItemCommentLayout = tw.div`
  flex flex-col w-full space-y-4

  [&>.list]:flex [&>.list]:flex-col [&>.list]:w-full [&>.list]:space-y-2

  [&>.pagination]:flex [&>.pagination]:justify-center [&>.pagination]:items-center [&>.pagination]:w-full

  max-md:[&>.comment-count]:text-sm [&>.comment-count]:text-slate-400
`;
export const ItemCommentWriteBox = tw.div`
  flex flex-col w-full space-y-2
  [&>textarea]:w-full [&>textarea]:min-h-[2rem] [&>textarea]:max-h-[8rem] [&>textarea]:p-3
  [&>textarea]:rounded-lg [&>textarea]:bg-slate-500/30 
  [&>textarea]:border [&>textarea]:border-slate-500/20 [&>textarea]:focus:border-blue-500
  max-md:[&>textarea]:text-sm [&>textarea]:text-slate-300 
  [&>textarea]:resize-none [&>textarea]:transition-colors

  [&>button]:w-24 [&>button]:h-9 [&>button]:ml-auto
  [&>button]:rounded-full [&>button]:bg-blue-500/40 [&>button]:hover:bg-blue-500/50
  [&>button]:text-sm [&>button]:text-white
  [&>button]:transition-colors
`;
export const ItemCommentBox = tw.div`
  ${({ $is_deleted }: StyleProps) => ($is_deleted ? 'hidden' : 'flex')}
  flex-col w-full max-md:py-2.5 p-3 max-md:space-y-0.5 md:space-y-2
  rounded-lg bg-slate-500/20

  [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:w-full
  [&>.header>.user]:flex [&>.header>.user]:items-center [&>.header>.user]:space-x-1
  [&>.header>.user]:text-slate-300/80
  max-md:[&>.header>.user>i]:text-[11px] max-md:[&>.header>.user>span]:text-xs
  md:[&>.header>.user>i]:text-xs md:[&>.header>.user>span]:text-sm

  [&>.content]:flex [&>.content]:flex-nowrap
  [&>.content]:font-light [&>.content]:leading-[165%] 
  max-md:[&>.content]:text-sm
`;

export const ItemControlButton = tw.button<StyleProps>`
  p-1
  text-xs text-slate-400 hover:text-slate-300
  rounded-lg
  ${({ $is_active }: StyleProps) => ($is_active ? 'bg-slate-500/50' : '')}
  transition-colors
`;
