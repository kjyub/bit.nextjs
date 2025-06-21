'use client';
import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import type { IMarketPageSearchParams } from '@/app/(front)/crypto/[code]/page';
import ModalContainer from '@/components/ModalContainer';
import { MARKET_COMMUNITY_PAGE_SIZE } from '@/constants/CryptoConsts';
import { useUser } from '@/hooks/useUser';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import * as CS from '@/styles/CryptoMarketCommunityStyles';
import { TextFormats } from '@/types/CommonTypes';
import Pagination from '@/types/api/pagination';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import type User from '@/types/users/User';
import { UserTypes } from '@/types/users/UserTypes';
import CommonUtils from '@/utils/CommonUtils';
import FrontUtils from '@/utils/FrontUtils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import CommunityPagination from '../../atomics/community/CommunityPagination';
import CommunitySearch from '../../atomics/community/CommunitySearch';
import CryptoMarketCommunityEditor from './CommunityEditor';
import CryptoMarketCommunityView from './CommunityView';

interface ICryptoMarketCommunity {
  marketCode: string;
  searchParams: IMarketPageSearchParams;
  communityListData: Record<string, any>;
  isLoading?: boolean;
}
export default function CryptoMarketCommunity({
  marketCode,
  searchParams,
  communityListData,
  isLoading = false,
}: ICryptoMarketCommunity) {
  const pagination = new Pagination<MarketCommunity>();
  pagination.parseResponse(communityListData, MarketCommunity);
  const pageIndex = Number(searchParams.page ?? 1);

  const { user } = useUser();

  const router = useRouter();
  const pathname = usePathname();

  const [isShowEditor, setShowEditor] = useState<boolean>(false);
  const [selectedCommunity, setSelectedCommunity] = useState<MarketCommunity>(new MarketCommunity());

  const handlePageIndex = (_pageIndex: number) => {
    const url = FrontUtils.getSearchUrl(pathname, searchParams, 'page', _pageIndex.toString());
    router.push(url, { scroll: true });
  };

  const handleSearch = (_search: string) => {
    const url = FrontUtils.getSearchUrl(pathname, searchParams, 'search', _search);
    router.push(url, { scroll: true });
  };

  const handleCreate = () => {
    setSelectedCommunity(new MarketCommunity());
    setShowEditor(true);
  };

  const handleUpdate = (_community: MarketCommunity) => {
    setSelectedCommunity(_community);
    setShowEditor(true);
  };

  return (
    <CS.Layout>
      <h1 className="title">
        <i className="fa-solid fa-comments-dollar"></i>
        토론방
      </h1>

      <CS.ListLayout>
        <div className="header">
          <CommunitySearch
            onSearch={handleSearch}
            defaultValue={searchParams.search}
            width="200px"
            placeholder="검색어를 입력하세요."
          />

          <span className="text-nowrap text-sm text-slate-500">
            {CommonUtils.textFormat(pagination.count, TextFormats.NUMBER)}개의 토론
          </span>
        </div>

        <div className="list">
          {pagination.items.map((community, index) => {
            return (
              <Community
                key={index}
                user={user}
                community={community}
                selectedCommunity={selectedCommunity}
                setSelectedCommunity={setSelectedCommunity}
                handleUpdate={handleUpdate}
              />
            );
          })}
          {isLoading && (
            <>
              <CommunitySkeleton />
              <CommunitySkeleton />
              <CommunitySkeleton />
              <CommunitySkeleton />
            </>
          )}
        </div>

        <div className="control">
          <p />
          <CommunityPagination
            page={pageIndex}
            setPage={handlePageIndex}
            itemCount={pagination.count}
            pageSize={MARKET_COMMUNITY_PAGE_SIZE}
            maxPageButtons={10}
          />

          <button
            type="button"
            onClick={() => {
              handleCreate();
            }}
          >
            <i className="fa-solid fa-pen"></i>
            글쓰기
          </button>
        </div>
      </CS.ListLayout>

      <ModalContainer isOpen={isShowEditor} setIsOpen={setShowEditor}>
        <CryptoMarketCommunityEditor
          marketCode={marketCode}
          community={selectedCommunity}
          onClose={() => {
            setShowEditor(false);
          }}
        />
      </ModalContainer>
    </CS.Layout>
  );
}

interface CommunityProps {
  user: User;
  community: MarketCommunity;
  selectedCommunity: MarketCommunity;
  setSelectedCommunity: React.Dispatch<React.SetStateAction<MarketCommunity>>;
  handleUpdate: (community: MarketCommunity) => void;
}
const Community = ({ user, community, selectedCommunity, setSelectedCommunity, handleUpdate }: CommunityProps) => {
  const isMaster = user.uuid === community.user.uuid || user.userType === UserTypes.STAFF;
  const isSelected = selectedCommunity.nanoId === community.nanoId;

  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const createToastMessage = useToastMessageStore((state) => state.createMessage);
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);

  const handleClick = () => {
    if (isSelected) {
      setSelectedCommunity(new MarketCommunity());
    } else {
      setSelectedCommunity(community);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleUpdate(community);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const isConfirmed = await createSystemMessage({
      type: 'confirm',
      content: '정말 삭제하시겠습니까?',
    });

    if (!isConfirmed) {
      return;
    }

    const response = await CryptoApi.deleteCommunity(community.nanoId);
    if (!response) {
      createToastMessage('삭제에 실패했습니다.');
      return;
    }

    createToastMessage('삭제되었습니다.');
    setIsDeleted(true);
  };

  return (
    <CS.ItemLayout $is_deleted={isDeleted}>
      <CS.ItemRow
        onClick={() => {
          handleClick();
        }}
        $is_active={isSelected}
      >
        {/* 1단 */}
        <div className="row">
          <h3 className="text-slate-300 flex-1 truncate">{community.title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">{CommonUtils.getDateShorten(community.createdDate)}</span>
            {isMaster && (
              <>
                <CS.ItemControlButton onClick={handleEdit}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </CS.ItemControlButton>
                <CS.ItemControlButton onClick={handleDelete}>
                  <i className="fa-solid fa-trash"></i>
                </CS.ItemControlButton>
              </>
            )}
          </div>
        </div>
        {/* 2단 */}
        <div className="row">
          <div className="infos">
            <div className="info">
              <i className="fa-solid fa-eye"></i>
              <span>{community.views}</span>
            </div>
            <div className="info">
              <i className="fa-solid fa-thumbs-up"></i>
              <span id={`likes-${community.nanoId}`}>{community.likes}</span>
            </div>
            <div className="info">
              <i className="fa-solid fa-comment"></i>
              <span id={`comments-${community.nanoId}`}>{community.comments}</span>
            </div>
          </div>

          <div className="infos">
            <div className="info">
              <i className="fa-solid fa-user"></i>
              <span>{community.user.nickname}</span>
            </div>
          </div>
        </div>
      </CS.ItemRow>

      {selectedCommunity.nanoId === community.nanoId && (
        <CryptoMarketCommunityView user={user} communityNanoId={community.nanoId} />
      )}
    </CS.ItemLayout>
  );
};

const CommunitySkeleton = () => {
  return (
    <div className="w-full p-2">
      <div className="w-full h-15 rounded-lg skeleton" />
    </div>
  );
};
