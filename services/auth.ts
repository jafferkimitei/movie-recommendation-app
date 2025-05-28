
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth/options";

export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};


