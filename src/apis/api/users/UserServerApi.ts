import { authServerInstance } from '@/apis/utils/instances';
import type { Options } from 'ky';

namespace UserServerApi {
  export async function getUserCurrentData(_options: Options = {}): Promise<object> {
    let userData = {};

    try {
      const response = await authServerInstance(_options).get('api/users/detail_info_auth/', {
        next: { revalidate: 10 },
      });
      const data = (await response.json()) as any;
      userData = data;
    } catch {
      // console.log(error);
    }

    return userData;
  }
}

export default UserServerApi;
