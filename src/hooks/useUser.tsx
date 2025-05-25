import { AuthContext } from "@/store/providers/AuthProvider";
import User from "@/types/users/User";
import { useContext } from "react";

export const useUser = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useUser must be used within a AuthProvider");
  }

  return value;
};
