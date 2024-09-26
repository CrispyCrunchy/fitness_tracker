"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "@mui/material";
import { useParams } from "next/navigation";
import Link from "next/link";

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

  const cancelOngoingWorkout = useMutation({
    mutationFn: () => api.createScheduledWorkout({
      name: ongoingWorkout.data.name as string,
      distance: ongoingWorkout.data.distance as number,
      timeGoal: ongoingWorkout.data.timeGoal as number,
      dateOfWorkout: ongoingWorkout.data.dateOfWorkout as Date
    }),
    onSuccess: () => clearOngoingWorkout.mutate()
  });

  const clearOngoingWorkout = useMutation({
    mutationFn: () => api.deleteOngoingWorkout(ongoingWorkout.data.id as string),
    onSuccess: () => queryClient.invalidateQueries()
  })

  const resetAndCancel = () => {
    if (time === 0) {
      cancelOngoingWorkout.mutate();
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
    onSuccess: () => clearOngoingWorkout.mutate()
  });

  return (
    <div>
      {ongoingWorkout.isLoading ?
        <div className="animate-pulse md:grid md:grid-cols-3 flex flex-col p-5 text-center gap-4 mt-10">
          <div className="md:col-span-1 flex flex-col md:gap-10 gap-4">
            <h2 className="bg-orange-300 rounded-full p-4 font-bold" />
            <div className="flex justify-between">
              <h3 className="bg-gray-500 rounded-full p-3 w-24" />
              <p className="bg-gray-500 rounded-full p-3 w-28" />
            </div>
            <div className="flex justify-between">
              <h3 className="bg-gray-500 rounded-full p-3 w-28" />
              <p className="bg-gray-500 rounded-full p-3 w-24" />
            </div>
            <div className="flex w-full justify-between">
              <h3 className="bg-gray-500 rounded-full p-3 w-24" />
              <p className="bg-gray-500 rounded-full p-3 w-28" />
            </div>
          </div>
          <div className="md:col-span-2 m-auto">
            <div className="md:text-7xl text-6xl">
              {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </div>
            <div className="flex gap-2 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 hover:cursor-not-allowed p-2 mt-6 rounded-xl w-20">
                <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 hover:cursor-not-allowed p-2 mt-6 rounded-xl w-20">
                <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 hover:cursor-not-allowed p-2 mt-6 rounded-xl w-20">
                <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </button>
            </div>
          </div>
        </div> 
      : 
        <> 
          {ongoingWorkout.isSuccess ? 
            <div className="md:grid md:grid-cols-3 flex flex-col p-5 text-center gap-4 mt-10">
              <div className="md:col-span-1 flex flex-col md:gap-10 gap-4">
                <h2 className="text-orange-300 text-2xl font-bold">{ongoingWorkout.data.name}</h2>
                <div className="flex justify-between">
                  <h3 className="font-bold">Date:</h3>
                  <p>{new Date(ongoingWorkout.data.dateOfWorkout).toISOString().slice(0,10)}</p>
                </div>
                <div className="flex justify-between">
                  <h3 className="font-bold">Distance:</h3>
                  <p>{ongoingWorkout.data.distance} meters</p>
                </div>
                <div className="flex w-full justify-between">
                  <h3 className="font-bold">Time Goal:</h3>
                  <p>{new Date(ongoingWorkout.data.timeGoal).toISOString().slice(11,19)}</p>
                </div>
              </div>
              <div className="md:col-span-2 m-auto">
                <div className="md:text-7xl text-6xl">
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}:
                  {milliseconds.toString().padStart(2, "0")}
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={resetAndCancel} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">
                    {cancelOngoingWorkout.isPending || clearOngoingWorkout.isPending ? <>
                      <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </> : <>{time ? "Reset" : "Cancel"}</>}
                  </button>
                  <button onClick={startAndStop} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">{isRunning ? "Stop" : "Start"}</button>
                  <button onClick={() => (finishWorkout.mutate())} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">
                    {finishWorkout.isPending || clearOngoingWorkout.isPending ? <>
                      <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </> : "Finish"}
                  </button>
                </div>
              </div>
            </div>
          : 
            <div className="flex flex-col mt-20 text-center gap-6 ">
              <p className="text-xl">You have no ongoing workout!</p>
              <div className="flex flex-col justify-center gap-4 md:bg-gray-900 md:rounded-3xl m-auto p-4">
                <div className="flex justify-between gap-4 align-middle">
                  <p className="mt-2">Start or schedule a workout:</p>
                  <Link href={"/app/schedule/" + params.userId} className="bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-24 h-fit">
                    Schedule
                  </Link>
                </div>
                <div className="flex justify-between gap-4 align-middle">
                  <p className="mt-2">Check out your completed workouts:</p>
                  <Link href={"/app/history/" + params.userId} className="bg-orange-500 hover:bg-orange-600 p-2 rounded-xl w-24 h-fit">History</Link>
                </div>
              </div>
            </div>
          }
        </> 
      }
    </div>
  );
}