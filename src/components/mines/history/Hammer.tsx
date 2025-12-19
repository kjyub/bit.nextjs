import type MineRoom from '@/types/mines/MineRoom';
import DateUtils from '@/utils/DateUtils';
import FormatUtils from '@/utils/FormatUtils';
import { TextFormats } from '@/types/CommonTypes';
import { MineHistoryStyles as S } from './styles';
import { cn } from '@/utils/StyleUtils';

export default function Maze({ room }: { room: MineRoom }) {
  return (
    <S.MineHistoryItem key={room.id}>
      <S.MineHistoryItemHeader>
        <div className="left">
          <span className="nickname">{room.userName}</span>
          <div className="game-type">망치</div>
          <div className={cn(['game-mode', { practice: room.isPractice }])}>{room.isPractice ? '연습' : '실전'}</div>
        </div>
        <span className="date">{DateUtils.getDateShorten(room.updatedDate)}</span>
      </S.MineHistoryItemHeader>
      <S.MineHistoryItemBody>
        <span className="reward">+{FormatUtils.textFormat(room.reward, TextFormats.NUMBER)}W</span>
        <span className="info">{`최고: ${room.hammerGame.highScore}`}</span>
      </S.MineHistoryItemBody>
    </S.MineHistoryItem>
  );
}
