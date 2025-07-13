import tw from 'tailwind-styled-components';

export namespace MineHistoryStyles {
  export const MineHistoryItem = tw.div`
    flex flex-col justify-center w-full px-2 py-3 gap-2
  `;

  export const MineHistoryItemHeader = tw.div`
    flex justify-between items-center w-full
    [&>.left]:flex [&>.left]:items-center [&_.left]:gap-1
    [&_.game-type]:px-1.5 [&_.game-type]:py-0 [&_.game-type]:text-xs [&_.game-type]:text-amber-500/80 [&_.game-type]:bg-stone-800 [&_.game-type]:rounded-full
    [&_.game-mode]:px-0.5 [&_.game-mode]:py-0 [&_.game-mode]:text-xs [&_.game-mode]:text-orange-500/80 [&_.game-mode.practice]:text-stone-500
    [&_.nickname]:text-[13px] [&_.nickname]:text-stone-400
    [&_.date]:text-xs [&_.date]:text-stone-500
  `;

  export const MineHistoryItemBody = tw.div`
    flex justify-between items-center w-full font-medium
    [&_.reward]:text-stone-300
    [&_.info]:flex [&_.info]:items-center [&_.info]:text-stone-300
    [&_.info_icon]:text-sm [&_.info_icon]:mr-1
  `;
}
