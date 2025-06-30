import { CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import type CryptoFlex from '@/types/cryptos/CryptoFlex';
import { PositionTypes } from '@/types/cryptos/CryptoTypes';
import CryptoUtils from '@/utils/CryptoUtils';
import { cn } from '@/utils/StyleUtils';
import TypeUtils from '@/utils/TypeUtils';
import dayjs from 'dayjs';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

const Layout = tw.div`
  relative flex justify-between w-full max-sm:h-44 sm:h-48 gap-2 p-6 rounded-2xl bg-slate-600/30 overflow-hidden group
`;

const PriceInfoBox = tw.div`
  flex flex-col w-fit mt-1 gap-1 max-md:text-xs md:text-[13px]
  [&>dl]:flex [&>dl]:justify-between [&>dl]:gap-1
  [&>dl>dt]:w-20 [&>dl>dt]:font-light [&>dl>dt]:text-slate-400 
  [&>dl>dd]:text-right [&>dl>dd]:font-semibold [&>dl>dd]:text-indigo-500
`;

const IconBox = tw.div`
  absolute max-sm:inset-y-0 max-sm:right-0 sm:top-0 sm:right-0 flex flex-center aspect-square max-sm:h-32 sm:h-full max-sm:my-auto rounded-xl
  [&>i]:absolute [&>i]:text-slate-300/70 max-sm:[&>i]:text-5xl sm:[&>i]:text-7xl
`;

interface Props {
  flex: CryptoFlex;
}
export default function FlexItem({ flex }: Props) {
  const imageCode = flex.position.market.code.split('-')[1];
  const pnlRatio = flex.position.pnlRatio;
  return (
    <Layout>
      <div className="flex flex-col gap-1">
        {/* PNL */}
        <div
          className={cn([
            'flex items-baseline gap-2 text-slate-300',
            { 'text-position-long-strong': pnlRatio > 0, 'text-position-short-strong': pnlRatio < 0 },
          ])}
        >
          <p className={cn(['flex items-center max-sm:text-xl sm:text-2xl font-semibold'])}>
            <span>{(pnlRatio > 0 ? '+' : '') + TypeUtils.percent(pnlRatio, 2)}</span>
          </p>

          <p className={cn(['flex items-center max-sm:text-sm'])}>
            <span>
              {(pnlRatio > 0 ? '+' : '') + CryptoUtils.getPriceText(flex.position.pnl - flex.position.totalFee)}
              {CRYPTO_WALLET_UNIT}
            </span>
          </p>
        </div>

        {/* 포지션 정보 */}
        <div className="flex items-center [&>*]:text-sm [&>*]:font-light [&>.split]:h-4 [&>.split]:mx-3 [&>.split]:border-l [&>.split]:border-slate-500/50">
          <span
            className={cn({
              'text-position-long-strong': flex.position.positionType === PositionTypes.LONG,
              'text-position-short-strong': flex.position.positionType === PositionTypes.SHORT,
            })}
          >
            {flex.position.positionType === PositionTypes.LONG ? '롱' : '숏'}
          </span>
          <div className="split"></div>
          <span className="text-slate-300">{flex.position.averageLeverage}x</span>
          <div className="split"></div>
          <Link href={`/crypto/${flex.position.market.code}`} className="text-slate-300 flex items-center gap-1">
            {flex.position.market.code}
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
          </Link>
        </div>

        {/* 가격 정보 */}
        <PriceInfoBox>
          <dl>
            <dt>평균 매입 가격</dt>
            <dd>
              {CryptoUtils.getPriceText(flex.position.averagePrice)}
              {CRYPTO_WALLET_UNIT}
            </dd>
          </dl>
          <dl>
            <dt>평균 매도 가격</dt>
            <dd>
              {CryptoUtils.getPriceText(flex.position.averageClosePrice)}
              {CRYPTO_WALLET_UNIT}
            </dd>
          </dl>
        </PriceInfoBox>

        {/* 게시자 정보 */}
        <div className="flex items-center mt-auto gap-2 text-xs">
          <span className="text-slate-400">
            <i className="fa-solid fa-user text-xs mr-1"></i>
            {flex.user.nickname}
          </span>
          <span className="text-slate-400">
            <i className="fa-solid fa-clock text-xs mr-1"></i>
            {dayjs(flex.position.closeTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
      </div>

      <IconBox>
        <img
          src={`https://static.upbit.com/logos/${imageCode}.png`}
          alt="coin"
          className="absolute top-0 right-0 size-16 scale-300 group-hover:scale-270 transition-all duration-500 object-contain rotate-15 blur-[1px] grayscale-50 contrast-50 brightness-50 opacity-20"
        />
        {flex.position.pnl === 0 && <i className="fa-solid fa-diamond"></i>}
        {flex.position.pnl > 0 && <i className="fa-solid fa-rocket"></i>}
        {flex.position.pnl < 0 && <i className="fa-solid fa-person-falling"></i>}
      </IconBox>
    </Layout>
  );
}

export const FlexItemSkeleton = ({
  ref,
  isShow = true,
}: { ref?: React.RefObject<HTMLDivElement>; isShow?: boolean }) => {
  return (
    <Layout ref={ref} className={cn({ 'opacity-0': !isShow })}>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2 text-slate-300">
          <div className="w-16 h-8 skeleton"></div>
          <div className="w-16 h-6 skeleton"></div>
        </div>
        <div className="skeleton w-40 h-5"></div>
      </div>
    </Layout>
  );
};
