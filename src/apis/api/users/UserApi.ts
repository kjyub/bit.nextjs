import { authInstance, credentialInstance, defaultInstance } from '@/apis/utils/instances';
import User from '@/types/users/User';
import type { UserType } from '@/types/users/UserTypes';
import type { LoginResponse } from '@/types/users/UserTypes';

namespace UserApi {
  // export async function getAccessToken() {
  //     let notes = []

  //     await defaultInstance.post("/api/users/login/").then(({data}) => {
  //         console.log(data)
  //     }).catch(error => {
  //         console.log(error)
  //     })

  //     return result
  // }
  export async function refreshToken(refreshToken?: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_SERVER}/api/users/jwt_auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as any;
      result.token.access = data.access;
      result.token.refresh = data.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getLogin(email: string, password: string, userType: UserType): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await defaultInstance.post('api/users/login/', {
        json: { email: email, password: password, user_type: userType },
      });
      const data = (await response.json()) as any;
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function kakaoAuth(code: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_SERVER}/api/users/kakao_auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as any;
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function backdoorAuth(email: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_SERVER}/api/users/backdoor_login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as any;
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function kakaoAuthSignup(requestData: object): Promise<object> {
    let responseData = {};

    try {
      const response = await authInstance.put('api/users/kakao_auth/', { json: requestData });
      const data = (await response.json()) as any;
      responseData = data.user;
    } catch (error) {
      console.log(error);
    }

    return responseData;
  }
  export async function checkEmail(email: string, userType: UserType): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_check_email/', {
        json: { email: email, user_type: userType },
      });
      const data = (await response.json()) as any;
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function checkNickname(nickname: string): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_check_nickname/', { json: { nickname: nickname } });
      const data = (await response.json()) as any;
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function findEmail(name: string, tel: string, userType: UserType): Promise<Array<string>> {
    let result: Array<string> = [];

    try {
      const response = await defaultInstance.post('api/users/user_find_email/', {
        json: { name: name, tel: tel, user_type: userType },
      });
      const data = (await response.json()) as any;
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function findPasswordCheck(email: string, name: string, tel: string, userType: UserType): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_find_password/', {
        json: { email: email, name: name, tel: tel, user_type: userType },
      });
      const data = (await response.json()) as any;
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function findPasswordUpdate(
    email: string,
    name: string,
    tel: string,
    userType: UserType,
    password: string,
  ): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.put('api/users/user_find_password/', {
        json: {
          email: email,
          name: name,
          tel: tel,
          user_type: userType,
          password: password,
        },
      });
      const data = (await response.json()) as any;
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function signup(data: object): Promise<[User, string]> {
    const user: User = new User();
    const error = '';

    try {
      const response = await defaultInstance.post('api/users/signup/', { json: data });
      const responseData = (await response.json()) as any;
      user.parseResponse(responseData.user as any);
    } catch (error) {
      console.log(error);
    }

    return [user, error];
  }
  export async function getUserCurrent(): Promise<User> {
    const result = new User();

    try {
      const response = await authInstance.get('api/users/detail_info_auth/');
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getUserDataSelf(): Promise<object> {
    let userData = {};

    try {
      const response = await authInstance.get('api/users/detail_info_auth/');
      const data = (await response.json()) as any;
      userData = data;
    } catch (error) {
      console.log(error);
    }

    return userData;
  }
}

export default UserApi;
