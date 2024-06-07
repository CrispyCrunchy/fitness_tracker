"use client";

import Workout from "@/components/Workout";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";


export default function History () {

  const { data: session } = useSession();
  const params = useParams();

  const workouts = useQuery({
    queryKey: ["user", params.userId],
    queryFn: () => api.getUserWorkouts(params.userId as string)
  });



  return(
    <div className="mb-16">
      {workouts.isLoading ? <p>Loading...</p> : null}
      {workouts.isSuccess ? (
        <>
          {workouts.data.map((workout: any, index: any) => (
            <Workout workout={workout} key={index} />
          ))}
        </>
      ) : null}
    </div>
  );
}