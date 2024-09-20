"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "@mui/material";
import { useParams } from "next/navigation";

export default function App() {

  const params = useParams();
  const queryClient = useQueryClient();
  const [ time, setTime ] = useState(0);
  const [ isRunning, setIsRunning ] = useState(false);

  const ongoingWorkout = useQuery({
    queryKey: ["ongoingWorkout", params.userId],
    queryFn: () => api.getUserOngoingWorkout(params.userId as string)
  });

  useEffect (() => {
    let intervalId: any;
    if (isRunning) {
      //Incrementing time by 1 every 10 milliseconds 
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const minutes = Math.floor(time / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const startAndStop = () => {
    setIsRunning(!isRunning);
  }

  const resetAndCancel = () => {
    if (time === 0) {

    } else {
      setTime(0);
    }
  }

  const finishWorkout = useMutation({
    mutationFn: () => api.createCompletedWorkout({ 
      name: ongoingWorkout.data.name,
      distance: ongoingWorkout.data.distance,
      timeGoal: ongoingWorkout.data.timeGoal,
      dateOfWorkout: ongoingWorkout.data.dateOfWorkout,
      compleationTime: time
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      setTime(0);
      setIsRunning(false);
    }
  });

  if (ongoingWorkout.isSuccess) {
    console.log(ongoingWorkout.data);
  }

  return (
    <div>
      {ongoingWorkout.isSuccess ? ( 
        <div className="flex flex-col p-5 text-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Your Workout: {ongoingWorkout.data.name}</h2>
            
            <div className="flex justify-center gap-8 mt-5">
              <div>
                <h3 className="font-bold">Distance:</h3>
                <p>{ongoingWorkout.data.distance} meters</p>
              </div>
              <div>
                <h3 className="font-bold">Time Goal:</h3>
                <p>{new Date(ongoingWorkout.data.timeGoal).toISOString().slice(11,19)}</p>
              </div>
            </div>
          </div>
          <div>
            <div className="text-6xl">
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={resetAndCancel} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">{time ? "Reset" : "Cancel"}</button>
              <button onClick={startAndStop} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">{isRunning ? "Stop" : "Start"}</button>
              <button onClick={() => (finishWorkout.mutate() /*, refresh element*/)} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">Finish</button>
            </div>
          </div>
        </div>
      ) : (
        <>no ongoing workout</>
      )}
    </div>
  );
}