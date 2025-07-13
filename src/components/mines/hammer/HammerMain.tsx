import { use, useEffect, useRef, useState } from 'react';

import { MineContext } from '../MinePlay';
import { cn } from '@/utils/StyleUtils';
import Hammer from './Hammer';

const ROUND = 3;
const START_HP = 10000;
const HIT_HP = 1200;
const HIT_MARGIN = 200;

const DAMAGE_RANGE = [50, 100];
const DAMAGE_INTERVAL_RANGE = [5, 200];

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

enum RoundState {
  READY = 'READY',
  PLAYING = 'PLAYING',
  COMPLETE = 'COMPLETE',
  FAIL = 'FAIL',
}

export default function HammerMain() {
  const { round, setRound, onComplete } = use(MineContext);
  const roundRef = useRef(round);
  const scoresRef = useRef<number[]>([]);

  const [hp, setHp] = useState(START_HP);
  const hpRef = useRef(START_HP);
  const [roundState, setRoundState] = useState(RoundState.READY);
  const roundStateRef = useRef(RoundState.READY);

  const [hammerState, setHammerState] = useState(0); // 0: 내려친 상태 100: 올라온 상태

  useEffect(() => {
    const handleKeyHit = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'f' || e.key === 'ㅇ' || e.key === 'ㄹ') {
        handleHit();
      }
    };
    window.addEventListener('keydown', handleKeyHit);
    return () => window.removeEventListener('keydown', handleKeyHit);
  }, []);

  useEffect(() => {
    startRound();
    roundRef.current = round;
  }, [round]);

  const updateHp = (hp: number) => {
    hpRef.current = hp;
    setHp(hp);
  }
  
  const updateRoundState = (state: RoundState) => {
    roundStateRef.current = state;
    setRoundState(state);
  }

  const calcHammerState = (hp: number) => {
    // hp가 START_HP일 경우 0
    // hp가 HIT_HP에 도달한 경우 100
    let angle = 100 - ((hp - HIT_HP) / (START_HP - HIT_HP) * 100);
    if (angle > 100) {
      angle = 100;
    }
    setHammerState(angle);
  }

  const handleHit = () => {
    if (roundStateRef.current !== RoundState.PLAYING) return;

    const currentHp = hpRef.current;
    const isKill = currentHp > HIT_HP - HIT_MARGIN && currentHp < HIT_HP;

    // 내려친 상태
    calcHammerState(START_HP);

    if (!isKill) {
      updateRoundState(RoundState.FAIL);
      return;
    }

    // 라운드 성공
    scoresRef.current.push(hpRef.current);
    updateHp(0);
    updateRoundState(RoundState.COMPLETE);

    if (roundRef.current < ROUND) {
      // 다음 라운드 시작
    } else {
      // 라운드 완료
      onComplete({
        scores: scoresRef.current,
      });
    }
  };

  const nextRound = () => {
    setRound(round + 1);
    updateRoundState(RoundState.READY);
  }

  const startRound = async () => {
    updateRoundState(RoundState.PLAYING);
    updateHp(START_HP);
    calcHammerState(START_HP);

    while (roundStateRef.current === RoundState.PLAYING) {
      const damage = getRandomInt(DAMAGE_RANGE[0], DAMAGE_RANGE[1]);
      const interval = getRandomInt(DAMAGE_INTERVAL_RANGE[0], DAMAGE_INTERVAL_RANGE[1]);
      await new Promise((resolve) => setTimeout(resolve, interval));

      if (roundStateRef.current !== RoundState.PLAYING) break;

      let nextHp = hpRef.current - damage;
      if (nextHp <= 0) {
        nextHp = 0;
        updateRoundState(RoundState.FAIL)
      }
      updateHp(nextHp);
      calcHammerState(nextHp);
    }
  }

  return (
    <div className="relative flex flex-col flex-center w-full aspect-square rounded-2xl overflow-hidden bg-stone-900">
      <div className="absolute top-2 z-10 flex flex-col items-center gap-2">
        <span className="text-stone-100 text-2xl font-medium">
          {hp}
        </span>
        <div className="relative w-48 h-2 bg-black rounded-full">
          <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full" style={{ width: `${hp / START_HP * 100}%` }} />
        </div>
        <span className="text-stone-300 text-sm">
          {`${HIT_HP - HIT_MARGIN} ~ ${HIT_HP} 사이일 때 내려치면 성공`}
        </span>
        <span className="text-stone-400 text-xs">
          (D, F 키 혹은 망치 클릭)
        </span>
      </div>

      <div className="absolute-center z-0 translate-y-1/16 size-2/3">
        <Hammer state={hammerState} onClick={handleHit} />
      </div>

      <button
        type="button"
        className={cn([
          'absolute bottom-4 z-10',
          'text-stone-100 text-sm bg-amber-700 rounded-full px-4 py-2',
          'transition-all duration-300',
          { 'translate-y-2 opacity-0 pointer-events-none': roundState !== RoundState.COMPLETE },
        ])}
        onClick={(e) => {
          e.stopPropagation();
          nextRound();
        }}
      >
        다음 라운드
      </button>
      <button
        type="button"
        className={cn([
          'absolute bottom-4 z-10',
          'text-stone-100 text-sm bg-stone-700 rounded-full px-4 py-2',
          'transition-all duration-300',
          { 'translate-y-2 opacity-0 pointer-events-none': roundState !== RoundState.FAIL },
        ])}
        onClick={(e) => {
          e.stopPropagation();
          startRound();
        }}
      >
        다시하기
      </button>
    </div>
  )
}
