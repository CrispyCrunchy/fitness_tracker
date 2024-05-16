"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    return redirect('/app');
  }

  return (
    <div className="flex justify-center mt-16">
      <div className="flex flex-col justify-center text-center gap-16">
        <div>
          <div className="flex justify-center">
            <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-32" />
          </div>
          <h1 className="text-5xl font-bold italic pb-3 pt-2">Striver</h1>
          <p className="italic">Always Striving, Always Improving</p>
        </div>
        <div className="flex flex-col gap-4">
          <p>You are not logged in!</p>
          <input className="rounded-md" placeholder="Email" />
          <input className="rounded-md" placeholder="Passsword" />
          <button onClick={async () => signIn('github')} className="bg-orange-500 hover:bg-orange-600 p-2 text-white rounded-xl w-full">Sign In</button>
          <button className="bg-orange-500 hover:bg-orange-600 p-2 text-white rounded-xl w-full">Register</button>
        </div>
      </div>
    </div>
  );
}
