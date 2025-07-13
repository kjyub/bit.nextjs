import type MineRoom from '@/types/mines/MineRoom';
import CommonUtils from '@/utils/CommonUtils';
import { secondsToTime } from '../maze/utils';
import { TextFormats } from '@/types/CommonTypes';
import { MineHistoryStyles as S } from './styles';
import { cn } from '@/utils/StyleUtils';

export default function Maze({ room }: { room: MineRoom }) {
  return (
    <S.MineHistoryItem key={room.id}>
      <S.MineHistoryItemHeader>
        <div className="left">
          <span className="nickname">{room.user.nickname}</span>
          <div className="game-type">미로</div>
          <div className={cn(['game-mode', { 'practice': room.isPractice }])}>
            {room.isPractice ? '연습' : '실전'}
          </div>
        </div>
        <span className="date">{CommonUtils.getDateShorten(room.updatedDate)}</span>
      </S.MineHistoryItemHeader>
      <S.MineHistoryItemBody>
        <span className="reward">+{CommonUtils.textFormat(room.reward, TextFormats.NUMBER)}W</span>
        <span className="info">
          <i className="fa-solid fa-stopwatch text-sm mr-1"></i>
          {secondsToTime(room.playTime)}
        </span>
      </S.MineHistoryItemBody>
    </S.MineHistoryItem>
  )
}