"use client";

import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";

export const useAuth = () => {
  const router = useRouter();

  const handleAuth = async () => {
    const session = await getServerSession();

    if (session) {
      router.push('/myaccount');
    } else {
      router.push('/login');
    }
  };

  return { handleAuth };
};
