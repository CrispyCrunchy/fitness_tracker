"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation () {

  const user = useQuery({
    queryKey: ['user'],
    queryFn: api.getCurrentUser
  })

  return (
    <div className="flex min-w-screen w-full absolute bottom-0 text-center">
      <Link href="/app" className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/3 text-sm">Workout</Link>
      <Link href={user.isSuccess ? "/app/history/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/3 text-sm">History</Link>
      <button onClick={() => signOut()} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/3 text-sm">Sign Out</button>
    </div>
  );
}

//link to statistics, implement later
//<Link href={user.isSuccess ? "/app/statistics/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">Statistics</Link>