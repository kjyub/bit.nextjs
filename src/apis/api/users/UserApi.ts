import User from '@/types/users/User';
import { UserTypeValues } from '@/types/users/UserTypeValues';
import { LoginResponse } from '@/types/users/UserTypes';
import { authInstance, credentialInstance, defaultInstance } from '@/apis/utils/instances';

class UserApi {
  // static async getAccessToken() {
  //     let notes = []

  //     await defaultInstance.post("/api/users/login/").then(({data}) => {
  //         console.log(data)
  //     }).catch(error => {
  //         console.log(error)
  //     })

  //     return result
  // }
  static async refreshToken(refreshToken?: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DJANGO_SERVER + '/api/users/jwt_auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      result.token.access = data.access;
      result.token.refresh = data.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getLogin(email: string, password: string, userType: UserTypeValues): Promise<LoginResponse> {
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
      const data = await response.json();
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async kakaoAuth(code: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DJANGO_SERVER + '/api/users/kakao_auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async backdoorAuth(email: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_DJANGO_SERVER + '/api/users/backdoor_login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      result.user = data.user;
      result.token.access = data.token.access;
      result.token.refresh = data.token.refresh;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async kakaoAuthSignup(requestData: object): Promise<object> {
    let responseData = {};

    try {
      const response = await authInstance.put('api/users/kakao_auth/', { json: requestData });
      const data = await response.json();
      responseData = data.user;
    } catch (error) {
      console.log(error);
    }

    return responseData;
  }
  static async checkEmail(email: string, userType: UserTypeValues): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_check_email/', {
        json: { email: email, user_type: userType },
      });
      const data = await response.json();
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async checkNickname(nickname: string): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_check_nickname/', { json: { nickname: nickname } });
      const data = await response.json();
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async findEmail(name: string, tel: string, userType: UserTypeValues): Promise<Array<string>> {
    let result: Array<string> = [];

    try {
      const response = await defaultInstance.post('api/users/user_find_email/', {
        json: { name: name, tel: tel, user_type: userType },
      });
      const data = await response.json();
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async findPasswordCheck(email: string, name: string, tel: string, userType: UserTypeValues): Promise<boolean> {
    let result = false;

    try {
      const response = await defaultInstance.post('api/users/user_find_password/', {
        json: { email: email, name: name, tel: tel, user_type: userType },
      });
      const data = await response.json();
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async findPasswordUpdate(
    email: string,
    name: string,
    tel: string,
    userType: UserTypeValues,
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
      const data = await response.json();
      result = data;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async signup(data: object): Promise<[User, string]> {
    const user: User = new User();
    const error = '';

    try {
      const response = await defaultInstance.post('api/users/signup/', { json: data });
      const data = await response.json();
      user.parseResponse(data.user as object);
    } catch (error) {
      console.log(error);
    }

    return [user, error];
  }
  static async getUserCurrent(): Promise<User> {
    const result = new User();

    try {
      const response = await authInstance.get('api/users/detail_info_auth/');
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getUserDataSelf(): Promise<object> {
    let userData = {};

    try {
      const response = await authInstance.get('api/users/detail_info_auth/');
      const data = await response.json();
      userData = data;
    } catch (error) {
      console.log(error);
    }

    return userData;
  }
}

export default UserApi;
