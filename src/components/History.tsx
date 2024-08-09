"use client";

import Workout from "@/components/Workout";
import api from "@/lib/axios";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";


export default function History () {

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getCurrentUser
  });

  const workouts = useQuery({
    queryKey: ["workouts", user.data?.id],
    queryFn: () => api.getUserWorkouts(user.data?.id as string)
  });

  // Add call to action if empty
  return(
    <div className="mb-16 h-full">
      {workouts.isLoading ? (
        <div>
          {[...Array(3)].map((e, index) => 
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
      {workouts.isSuccess ? (
        <>
          { (workouts.data.length === 0) ? (
            <div className="flex flex-col justify-center align-middle">
              <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-32" />
              <p>You have no compleated workouts!</p>
              <Link href="/app" className="bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-full">Get Started!</Link>
            </div>
          ) : (
            <>
              {workouts.data.map((workout: any, index: any) => (
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