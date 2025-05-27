import User from '@/types/users/User';
import { UserTypeValues } from '@/types/users/UserTypeValues';
import { LoginResponse } from '@/types/users/UserTypes';
import { authInstance, credentialInstance, defaultInstance } from '../../utils/api';

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

    await credentialInstance
      .post('/api/users/jwt_auth/refresh/', { refresh: refreshToken })
      .then(({ data }) => {
        result.token.access = data.access;
        result.token.refresh = data.refresh;
      })
      .catch((error) => {
        console.log(error);
      });

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

    await defaultInstance
      .post('/api/users/login/', { email: email, password: password, user_type: userType })
      .then(({ data }) => {
        result.user = data.user;
        result.token.access = data.token.access;
        result.token.refresh = data.token.refresh;
      })
      .catch((error) => {
        console.log(error);
      });

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

    await defaultInstance
      .post('/api/users/kakao_auth/', { code: code })
      .then(({ data }) => {
        result.user = data.user;
        result.token.access = data.token.access;
        result.token.refresh = data.token.refresh;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async backdoorAuth(email: string): Promise<LoginResponse> {
    let responseData = {};

    await defaultInstance
      .post('/api/users/backdoor_login/', { email: email })
      .then(({ data }) => {
        responseData = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return responseData;
  }
  static async kakaoAuthSignup(requestData: object): Promise<object> {
    let responseData = {};

    await authInstance
      .put('/api/users/kakao_auth/', requestData)
      .then(({ data }) => {
        responseData = data.user;
      })
      .catch((error) => {
        console.log(error);
      });

    return responseData;
  }
  static async checkEmail(email: string, userType: UserTypeValues): Promise<boolean> {
    let result = false;

    await defaultInstance
      .post('/api/users/user_check_email/', { email: email, user_type: userType })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async checkNickname(nickname: string): Promise<boolean> {
    let result = false;

    await defaultInstance
      .post('/api/users/user_check_nickname/', { nickname: nickname })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async findEmail(name: string, tel: string, userType: UserTypeValues): Promise<Array<string>> {
    let result: Array<string> = [];

    await defaultInstance
      .post('/api/users/user_find_email/', { name: name, tel: tel, user_type: userType })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async findPasswordCheck(email: string, name: string, tel: string, userType: UserTypeValues): Promise<boolean> {
    let result = false;

    await defaultInstance
      .post('/api/users/user_find_password/', { email: email, name: name, tel: tel, user_type: userType })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

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

    await defaultInstance
      .put('/api/users/user_find_password/', {
        email: email,
        name: name,
        tel: tel,
        user_type: userType,
        password: password,
      })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async signup(data: object): Promise<[User, string]> {
    const user: User = new User();
    const error = '';

    await defaultInstance
      .post('/api/users/signup/', data)
      .then((response) => {
        const userData = response.data.user;
        user.parseResponse(userData as object);
      })
      .catch((error) => {
        console.log(error);
      });

    return [user, error];
  }
  static async getUserCurrent(): Promise<User> {
    const result = new User();

    await authInstance
      .get('/api/users/detail_info_auth/')
      .then(({ data }) => {
        result.parseResponse(data as object);
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async getUserDataSelf(): Promise<object> {
    let userData = {};

    await authInstance
      .get('/api/users/detail_info_auth/')
      .then(({ data }) => {
        userData = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return userData;
  }
}

export default UserApi;
