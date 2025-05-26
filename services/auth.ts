
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const getAuthSession = async () => {
  return await getServerSession(authOptions);
};


