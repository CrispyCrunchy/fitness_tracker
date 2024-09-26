"use client";

import CompletedWorkout from "@/components/CompletedWorkout";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function History () {

  const params = useParams();

  const completedWorkouts = useQuery({
    queryKey: ["workouts", params.userId],
    queryFn: () => api.getUserCompletedWorkouts(params.userId as string)
  });


  // Add call to action if empty, and code skeleton when loading
  return(
    <div className="mb-16">
      {completedWorkouts.isLoading ? <>
        {[...Array(3)].map((workoutSkeleton: any, index: any) => 
          <div key={index} className="animate-pulse flex flex-col bg-gray-900 rounded-lg m-2 p-4 gap-1">
            <div className="w-1/2 rounded-full bg-orange-300 p-3 m-1" />
            <div className="flex w-full justify-between">
              <div className="w-1/3 rounded-full bg-gray-500 p-2 m-1" />
              <div className="w-1/3 rounded-full bg-gray-500 p-2 m-1" />
            </div>
            <div className="w-1/2 rounded-full bg-gray-500 p-2 m-1"/>
            <div className="flex w-full justify-between">
              <div className="w-1/2 rounded-full bg-gray-500 p-2 m-1"/>
              <div className="w-1/4 rounded-lg bg-red-500 p-2 m-1" />
            </div>
          </div>
        )}
      </> : null}
      {completedWorkouts.isSuccess ? <>
        { completedWorkouts.data.length ? <>
          {completedWorkouts.data.map((workout: any, index: any) => (
            <CompletedWorkout workout={workout} key={index} />
          ))}
        </> : 
          <div className="flex flex-col space-y-5 text-center mt-28">
            <p>You have no compleated workouts!</p>
            <Link href={"/app/schedule/" + params.userId} className="flex bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-60 m-auto">Get Started!</Link>
          </div>
        }
      </> : null}
    </div>
  );
}