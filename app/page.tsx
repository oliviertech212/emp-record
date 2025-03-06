"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status , data } = useSession();
  const router = useRouter();
  const showSession = () => {
    if (status === "authenticated") {
        router.push("/myaccount");
    } else if (status === "loading") {
      return (
       <div className="flex min-h-screen flex-col items-center justify-center">
         <span className="text-white text-sm mt-7">Loading...</span>
       </div>
      )
    } else {
        router.push("/login");
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showSession()}
    </main>
  );
}