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
    <div className="flex min-w-screen w-full max-lg:bottom-0 lg:top-0 text-center fixed">
      <Link href="/app" className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/5 text-sm self-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lg:hidden mx-auto my-auto"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <p className="max-lg:hidden">Home</p>
      </Link>
      <Link href={user.isSuccess ? "/app/schedule/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/5 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lg:hidden mx-auto my-auto"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
        <p className="max-lg:hidden">Schedule</p>
      </Link>
      <Link href={user.isSuccess ? "/app/workout/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/5 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lg:hidden mx-auto my-auto"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
        <p className="max-lg:hidden">Workout</p>
      </Link>
      <Link href={user.isSuccess ? "/app/history/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/5 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lg:hidden mx-auto my-auto"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
        <p className="max-lg:hidden">History</p>
      </Link>
      <button onClick={() => signOut()} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/5 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lg:hidden mx-auto my-auto"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <p className="max-lg:hidden">Sign Out</p>
      </button>
    </div>
  );
}

//link to statistics, implement later
//<Link href={user.isSuccess ? "/app/statistics/" + user.data.id : "/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">Statistics</Link>