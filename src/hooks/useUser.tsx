import { AuthContext } from "@/store/providers/AuthProvider";
import User from "@/types/users/User";
import BrowserUtils from "@/utils/BrowserUtils";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export const useUser = (): { user: User; isLoading: boolean } => {
  const { user, isLoading } = useContext(AuthContext);
  const { data: session, status } = useSession();

  if (BrowserUtils.isClient()) {
    return { user, isLoading };
  } else {
    if (status === "authenticated") {
      const _user = new User();
      _user.parseResponse(session.user);
      return { user: _user, isLoading: false };
    }

    if (status === "unauthenticated") {
      return { user: new User(), isLoading: false };
    }
  }
};
