"use client";

import Workout from "@/components/Workout";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";


export default function History () {

  const { data: session } = useSession();
  const params = useParams();

  const workouts = useQuery({
    queryKey: ["workouts", params.userId],
    queryFn: () => api.getUserWorkouts(params.userId as string)
  });


  // Add call to action if empty, and code skeleton when loading
  return(
    <div className="mb-16">
      {workouts.isLoading ? (
        <div className="flex flex-col bg-gray-900 rounded-lg m-2 p-4">

        </div>
      ) : null}
      {workouts.isSuccess ? (
        <>
          { (workouts.data.length === 0) ? (
            <div className="flex flex-col space-y-5 justify-center text-center h-full m-5">
              <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="flex justify-center w-32 text-center" />
              <p>You have no compleated workouts!</p>
              <Link href="/app" className="flex bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-full">Get Started!</Link>
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
    </div>
  );
}