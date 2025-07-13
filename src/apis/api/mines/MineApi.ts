import { authInstance } from '@/apis/utils/instances';
import Pagination from '@/types/api/pagination';
import MineRoom from '@/types/mines/MineRoom';

namespace MineApi {
  // region MineRooms
  export async function getMineRooms(
    pageIndex: number,
    pageSize: number,
    onlyMine = false,
  ): Promise<Pagination<MineRoom>> {
    const result: Pagination<MineRoom> = new Pagination<MineRoom>();

    try {
      const response = await authInstance.get('api/mines/rooms/', {
        searchParams: { page: pageIndex, page_size: pageSize, only_mine: onlyMine },
      });
      const data = (await response.json()) as any;
      result.parseResponse(data, MineRoom);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function createMineRoom(requestData: object): Promise<MineRoom> {
    const result: MineRoom = new MineRoom();

    try {
      const response = await authInstance.post('api/mines/rooms/', { json: requestData });
      const data = (await response.json()) as any;
      result.parseResponse(data);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function validateMineRoom(): Promise<string> {
    let result = '';

    try {
      const response = await authInstance.get('api/mines/room/');
      const data = (await response.json()) as any;
      result = data.message;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getMineRoom(roomId: string): Promise<MineRoom> {
    const result: MineRoom = new MineRoom();

    try {
      const response = await authInstance.get(`api/mines/room/${roomId}/`);
      const data = (await response.json()) as any;
      result.parseResponse(data);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function updateMineRoom(roomId: string, gameData: object): Promise<MineRoom> {
    const result: MineRoom = new MineRoom();

    try {
      const response = await authInstance.put('api/mines/room/', {
        json: {
          room_id: roomId,
          ...gameData,
        },
      });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function updateMineRoomNickname(roomId: string, nickname: string): Promise<MineRoom> {
    const result: MineRoom = new MineRoom();

    try {
      const response = await authInstance.put('api/mines/room/nickname/', {
        json: {
          room_id: roomId,
          nickname,
        },
      });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
}

export default MineApi;
