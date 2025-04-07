'use client'
import { useUser } from '@/hooks/useUser'
import useMarketPriceStore from '@/store/useMarketPriceStore'
import useUserInfoStore from '@/store/useUserInfo'
import * as S from '@/styles/CryptoMarketStyles'
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces'
import CryptoMarket from '@/types/cryptos/CryptoMarket'
import { PriceChangeTypes, SizeUnitTypes } from '@/types/cryptos/CryptoTypes'
import CryptoUtils from '@/utils/CryptoUtils'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import CryptoMarketTrade from './CryptoMarketTrade'
import CryptoMarketChart from './chart/CryptoMarketChart'
import CryptoMyTrade from './mytrade/CryptoMyTradeMain'

interface ICryptoMarket {
  marketCode: string
  marketData: object
  marketCurrent: IUpbitMarketTicker
  communityNode: React.ReactNode
}
export default function CryptoMarketMain({ marketCode, marketData, marketCurrent, communityNode }: ICryptoMarket) {
  const [user, _isUserLoading] = useUser()
  const { updateInfo } = useUserInfoStore()

  useEffect(() => {
    updateInfo()
  }, [marketCode])

  // 설정 정보
  const [sizeUnitType, setSizeUnitType] = useState<SizeUnitTypes>(SizeUnitTypes.PRICE) // 단위 타입
  const imageCode = marketCode.split('-')[1]

  if (Object.keys(marketCurrent).length === 0) {
    return
  }

  return (
    <S.MarketLayout>
      <MarketInfo marketCode={marketCode} marketData={marketData} marketCurrent={marketCurrent} />

      {/* 코인 정보 */}
      <S.MainLayout>
        <S.ChartAndTradeLayout>
          <S.ChartLayout>
            <CryptoMarketChart marketCode={marketCode} />
          </S.ChartLayout>
          <S.TradeLayout>
            <CryptoMarketTrade
              user={user}
              marketCode={marketCode}
              unit={imageCode}
              sizeUnitType={sizeUnitType}
              setSizeUnitType={setSizeUnitType}
            />
          </S.TradeLayout>
        </S.ChartAndTradeLayout>
      </S.MainLayout>

      {/* 커뮤니티 */}
      <S.BottomLayout>
        <S.MyTradeLayout>
          <CryptoMyTrade />
        </S.MyTradeLayout>
        <S.CommunityLayout>{communityNode}</S.CommunityLayout>
      </S.BottomLayout>
    </S.MarketLayout>
  )
}

interface MarketInfoProps {
  marketCode: string
  marketData: object
  marketCurrent: IUpbitMarketTicker
}
const MarketInfo = ({ marketCode, marketData, marketCurrent }: MarketInfoProps) => {
  // 현재 시장 정보
  const imageCode = marketCode.split('-')[1]
  const currency = marketCode.split('-')[0]

  const socketData = useMarketPriceStore((state) => state.marketDic[marketCode])
  const [market, setMarket] = useState<CryptoMarket>(new CryptoMarket())

  const { changeType, price, changeRate, changePrice } = useMemo(() => {
    if (!socketData) {
      return {
        changeType: PriceChangeTypes.EVEN,
        price: marketCurrent.trade_price,
        changeRate: market.changeRate,
        changePrice: market.changePrice,
      }
    }
    return {
      changeType: CryptoUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price),
      price: socketData.trade_price,
      changeRate: socketData.signed_change_rate,
      changePrice: socketData.signed_change_price,
    }
  }, [socketData])

  const [priceWidth, setPriceWidth] = useState<number>(0)

  // 디자인 관련
  const [isTitleSticky, setTitleSticky] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = () => {
      setTitleSticky(window.scrollY > 56)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const _market = new CryptoMarket()
    _market.parseResponse(marketData)

    setMarket(_market)
  }, [marketData])

  useEffect(() => {
    setPriceWidth(CryptoUtils.getPriceTextLength(price) * 15 + 30)
  }, [price])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <S.TitleLayout
      $is_active={isTitleSticky}
      onClick={() => {
        handleScrollTop()
      }}
    >
      <div className="flex flex-col">
        {/* 코인 이름 */}
        <S.MainTitleBox>
          <div className="relative flex flex-cetner w-[28px] aspect-square">
            <Image fill={true} src={`https://static.upbit.com/logos/${imageCode}.png`} alt="coin" />
          </div>
          <h1 className="text-3xl text-slate-50 font-semibold">{market.koreanName}</h1>
          <div className="flex flex-col">
            <h2 className="text-sm text-slate-400">{market.englishName}</h2>
            <h2 className="text-[10px] text-slate-500">{market.code}</h2>
          </div>
        </S.MainTitleBox>

        {/* 코인 가격 */}
        <S.MainPriceBox
          className={`${changeType === PriceChangeTypes.RISE ? 'rise' : changeType === PriceChangeTypes.FALL ? 'fall' : ''} change`}
        >
          {/* tailwind 변수 테스트 */}
          <span className={`price`} style={{ width: `${priceWidth + 12}px` }}>
            {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," />  */}
            {CryptoUtils.getPriceText(price)}
            <span className="currency">{currency}</span>
          </span>

          <div className="change">
            <span className="rate">{(changeRate * 100).toFixed(2)}%</span>
            <span className="price">
              {CryptoUtils.getPriceText(changePrice)}
              <span className="currency">{currency}</span>
            </span>
          </div>
        </S.MainPriceBox>
      </div>

      <div className="flex flex-col pt-4">
        <S.MainPriceInfoGrid>
          <div>
            <span className="label">고가</span>
            <span className="value w-32 rise">{CryptoUtils.getPriceText(marketCurrent.high_price)}</span>
          </div>
          <div>
            <span className="label">거래량(24h)</span>
            <span className="value w-36 text-xs">{CryptoUtils.getPriceText(marketCurrent.acc_trade_volume_24h)}</span>
          </div>
          <div>
            <span className="label">저가</span>
            <span className="value w-32 fall">{CryptoUtils.getPriceText(marketCurrent.low_price)}</span>
          </div>
          <div>
            <span className="label">거래대금(24h)</span>
            <span className="value w-36 text-xs">{CryptoUtils.getPriceText(marketCurrent.acc_trade_price_24h)}</span>
          </div>
        </S.MainPriceInfoGrid>
      </div>
    </S.TitleLayout>
  )
}