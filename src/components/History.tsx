"use client";

import Workout from "@/components/Workout";
import api from "@/lib/axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";


export default function History () {

  const user = useQuery({
    queryKey: ["user"],
    queryFn: api.getCurrentUser
  });

  return(
    <div className="mb-16 h-full">
      {user.isLoading ? (
        <div>
          {[...Array(3)].map((workoutSkeleton: any, index: any) => 
              <div key={index} className="flex flex-col bg-gray-900 rounded-lg m-2 p-4">
                <div className="w-1/2 rounded-full bg-orange-300 p-2 m-1" />
                <div className="w-1/2 rounded-full bg-gray-500 p-1 m-1"/>
                <div className="flex w-full">
                  <div className="w-1/3 rounded-full bg-gray-500 p-1 m-1" />
                  <div className="w-1/3 rounded-full bg-gray-500 p-1 m-1" />
                </div>
                <div className="w-1/2 rounded-full bg-gray-500 p-1 m-1"/>
              </div>
            )
          }
        </div>
      ) : null}
      {user.isSuccess ? (
        <>
          { (user.data.workouts.length === 0) ? (
            <div className="flex flex-col space-y-5 justify-center text-center h-full m-5">
              <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-32" />
              <p>You have no compleated workouts!</p>
              <Link href="/app" className="bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-max justify-center">Get Started!</Link>
            </div>
          ) : (
            <>
              {user.data.workouts.map((workout: any, index: any) => (
                <Workout workout={workout} key={index} />
              ))}
            </>
          )}
        </>
      ) : null}
      <button onClick={() => signOut()} className="bg-orange-500 hover:bg-orange-600 p-2 text-white border-black border-x text-m absolute rounded-lg bottom-2 right-2">Sign Out</button>
    </div>
  );
}