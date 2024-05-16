"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation () {
  return (
    <div className="flex min-w-screen w-full absolute bottom-0 text-center">
      <Link href={"/app"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">Workout</Link>
      <Link href={"/app/history"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">History</Link>
      <Link href={"/app/statistics"} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">Statistics</Link>
      <button onClick={() => signOut()} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x basis-1/4 text-sm">Log Out</button>
    </div>
  );
}