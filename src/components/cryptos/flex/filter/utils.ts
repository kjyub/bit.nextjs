import type CryptoMarket from '@/types/cryptos/CryptoMarket';
import { assemble, disassembleToGroups } from 'es-hangul';

type HighlightType = 'none' | 'half' | 'full';
interface HightLightText {
  text: string;
  isHighlight: HighlightType;
}
const highlightText = (text: string, searchValue: string): Array<HightLightText> => {
  if (!searchValue.trim()) return [{ text, isHighlight: 'none' }];

  const textGroups = disassembleToGroups(text);
  const searchGroups = disassembleToGroups(searchValue);

  if (searchGroups.length === 0) return [{ text, isHighlight: 'none' }];

  // 검색어 그룹을 Set으로 변환하여 빠른 조회
  const searchSets = searchGroups.map((group) => new Set(group));

  const countMatch = (textGroup: Array<string>, searchSet: Set<string>): number => {
    let count = 0;
    for (const char of textGroup) {
      if (searchSet.has(char)) count++;
    }
    return count;
  };

  // 텍스트 그룹별 하이라이트 계산
  const highlightArray: Array<HightLightText> = [];
  for (const textGroup of textGroups) {
    let highlight: HighlightType = 'none';

    for (const searchSet of searchSets) {
      const matchCount = countMatch(textGroup, searchSet);

      if (matchCount >= textGroup.length) {
        highlight = 'full';
      } else if (matchCount > 1) {
        highlight = 'half';
      } else if (searchSet.size === 1 && matchCount > 0) {
        // 초성입력인 경우엔 조각 중 하나만 매칭되도 half 처리
        highlight = 'half';
      }
    }

    highlightArray.push({
      text: assemble(textGroup),
      isHighlight: highlight,
    });
  }

  // 연속성 체크 및 조정
  if (highlightArray.length > 1) {
    const continuousRanges: Array<{ start: number; end: number; count: number }> = [];

    for (let i = 0; i < highlightArray.length; i++) {
      if (highlightArray[i].isHighlight !== 'none') {
        let j = i;
        while (j < highlightArray.length && highlightArray[j].isHighlight !== 'none') {
          j++;
        }
        continuousRanges.push({ start: i, end: j - 1, count: j - i });
        i = j - 1;
      }
    }

    if (continuousRanges.length > 0) {
      const maxCount = Math.max(...continuousRanges.map((range) => range.count));

      // 최대 연속 길이보다 짧은 구간은 한 단계 낮춤
      for (const range of continuousRanges) {
        if (range.count < maxCount) {
          for (let i = range.start; i <= range.end; i++) {
            if (highlightArray[i].isHighlight === 'full') {
              highlightArray[i].isHighlight = 'half';
            } else if (highlightArray[i].isHighlight === 'half') {
              highlightArray[i].isHighlight = 'none';
            }
          }
        }
      }
    }
  }

  return highlightArray;
};

export interface MarketWithHighlight {
  market: CryptoMarket;
  koreanHighlights: Array<HightLightText>;
  codeHighlights: Array<HightLightText>;
  similarScore: number;
}
export const attachHighlightMarket = (market: CryptoMarket, searchValue: string): MarketWithHighlight => {
  let similarScore = 0;
  const koreanHighlights = highlightText(market.koreanName, searchValue);
  const codeHighlights = highlightText(market.code, searchValue.toUpperCase());

  if (koreanHighlights.length > 0) {
    similarScore += koreanHighlights.reduce((acc, highlight) => {
      if (highlight.isHighlight === 'full') {
        return acc + 100;
      }
      return acc;
    }, 0);

    similarScore += 100 - Math.abs(market.koreanName.length - searchValue.length);
  }

  if (codeHighlights.length > 0) {
    similarScore += codeHighlights.reduce((acc, highlight) => {
      if (highlight.isHighlight === 'full') {
        return acc + 100;
      }
      return acc;
    }, 0);

    similarScore += 100 - Math.abs(market.code.length - searchValue.length);
  }

  return {
    market,
    koreanHighlights: koreanHighlights,
    codeHighlights: codeHighlights,
    similarScore,
  };
};
