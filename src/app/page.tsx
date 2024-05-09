"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return /*redirect('/app')*/(
      <div>
        <p>Name: {session.user?.name}</p>
        <p>Email: {session.user?.email}</p>
        <img src={session.user?.image ?? ""} />
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-16">
      <div className="flex flex-col justify-center text-center gap-4">
        <p>You are not logged in!</p>
        <button onClick={async () => signIn('github')} className="bg-orange-500 hover:bg-orange-600 p-2 text-white rounded-xl">Sign In</button>
      </div>
    </div>
  );
}
