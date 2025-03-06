"use client";

import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react"
type Props = {
  
  children?: ReactNode;
};

export const Provider: React.FC<Props> = ({ children }) => {



  return <SessionProvider>{children}</SessionProvider>;
};
