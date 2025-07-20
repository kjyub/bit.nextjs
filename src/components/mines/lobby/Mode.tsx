import { cn } from '@/utils/StyleUtils';
import { GameTypes, type GameType } from '@/types/mines/MineTypes';

interface Props {
  title: string;
  loadingGame: GameType;
  handlePlay: (gameType: GameType) => void;
  children: React.ReactNode;
}
export default function Mode({ title, loadingGame, handlePlay, children }: Props) {
  return (
    <div className="flex flex-col items-center max-sm:w-[80vw] max-sm:h-72 sm:w-96 sm:h-96 p-6 gap-4 bg-stone-800 rounded-2xl">
      <h4 className="w-full text-xl font-bold text-stone-200">{title}</h4>

      <div className="flex flex-col justify-around items-center w-full h-full">
        {children}

        <div className="flex gap-2 sm:gap-4">
          <PlayButton gameType={GameTypes.MAZE} loadingGame={loadingGame} handlePlay={() => handlePlay(GameTypes.MAZE)}>
            미로게임
          </PlayButton>
          <PlayButton
            gameType={GameTypes.HAMMER}
            loadingGame={loadingGame}
            handlePlay={() => handlePlay(GameTypes.HAMMER)}
          >
            망치게임
          </PlayButton>
        </div>
      </div>
    </div>
  );
}

const PlayButton = ({
  gameType,
  loadingGame,
  handlePlay,
  children,
}: { gameType: GameType; loadingGame: GameType; handlePlay: () => void; children: React.ReactNode }) => {
  return (
    <button
      type="button"
      className={cn([
        'max-sm:px-4 max-sm:py-2 sm:px-8 sm:py-4 bg-orange-700/60 hover:bg-orange-700/80 text-stone-200 text-lg sm:text-xl font-bold rounded-3xl duration-200',
        { 'animate-bounce': loadingGame === gameType },
        { 'active:translate-y-1': loadingGame !== gameType },
      ])}
      onClick={handlePlay}
    >
      {children}
    </button>
  );
};
