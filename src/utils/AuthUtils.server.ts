import { CookieConsts } from "@/types/ApiTypes";
import { cookies } from "next/headers";

export default class AuthServerUtils {
  static async getAccessToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookieConsts.USER_ACCESS_TOKEN);
    return accessToken?.value;
  }
}
