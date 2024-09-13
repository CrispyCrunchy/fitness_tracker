"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "@mui/material";
import { useParams } from "next/navigation";
import ScheduledWorkout from "@/components/ScheduledWorkout";

export default function App() {

  const params = useParams();
  const queryClient = useQueryClient();
  const [ selected, setSelected ] = useState(NaN);
  const [ name, setName ] = useState("");
  const [ distance, setDistance ] = useState(NaN);
  const [ date, setDate ] = useState(new Date());
  const [ timeGoal, setTimeGoal ] = useState(NaN);
  const [ editWorkout, setEditWorkout ] = useState(NaN);
  const [ scheduleWorkoutError, setScheduleWorkoutError ] = useState(false);
  const [ minutesAndSeconds, setMinutesAndSeconds ] = useState({
    minutes: NaN,
    seconds: NaN
  });

  let scheduledWorkouts = useQuery({
    queryKey: ["scheduledWorkouts", params.userId],
    queryFn: () => api.getUserScheduledWorkouts(params.userId as string)
  });

  const createScheduledWorkout = useMutation({
    mutationFn: () => api.createScheduledWorkout({
      name: name,
      distance: distance,
      timeGoal: timeGoal,
      dateOfWorkout: date
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledWorkouts"] });
      setName("");
      setDistance(NaN);
      setDate(new Date());
      setTimeGoal(NaN);
      setMinutesAndSeconds({minutes: NaN, seconds: NaN});
    }
  });

  const scheduleWorkout = () => {
    if (name && distance && minutesAndSeconds && date) {
      setTimeGoal(minutesAndSeconds.minutes*60000 + minutesAndSeconds.seconds*1000);
      createScheduledWorkout.mutate();
    } else {
      setScheduleWorkoutError(true);
    }
  }

  if (scheduledWorkouts.isSuccess) {
    console.log(scheduledWorkouts.data[0])
  }

  return(
    <div className="flex w-full mt-5 h-screen">
      <div className="flex flex-col lg:w-1/3">
        <button onClick={() => setSelected(NaN)} className="flex bg-orange-500 hover:bg-orange-600 p-2 rounded-xl m-2 justify-center">
          <p>New Workout</p> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div>
          {scheduledWorkouts.isLoading ? <>
            {[...Array(3)].map((workoutSkeleton: any, index: any) => 
              <div key={index} className="flex flex-col bg-gray-900 rounded-lg m-2 p-4">
                <div className="w-1/2 rounded-full bg-orange-300 p-2 m-1" />
                <div className="w-2/3 rounded-full bg-gray-500 p-1 m-1"/>
              </div>
            )}
          </> : null}
          {scheduledWorkouts.isSuccess ? <>
            {scheduledWorkouts.data.length ? <>
              {scheduledWorkouts.data.map((workout: any, index: any) => (
                <button onClick={() => setSelected(index)}>
                  <ScheduledWorkout workout={workout} key={index} />
                </button>
              ))}
            </> :
              <div className="flex flex-col text-center mt-28">
                <p>You have no scheduled workouts.</p>
              </div>
            }
          </> : null}
        </div>
      </div>
      <div className="flex flex-col lg:w-2/3 bg-gray-900 m-1 rounded-md">
        { Number.isNaN(selected) ?
          <div className="flex flex-col p-5 text-center gap-4">
            <div className="flex flex-col gap-1 pt-4">
              <p className="">Name your workout</p>
              <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-md text-black" placeholder=" Workout"/>
            </div>
            <div className="flex flex-row gap-3">
              <div className="flex flex-col gap-2 w-1/2">
                <p className="">Distance</p>
                <input value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="rounded-md text-black" type="number" placeholder="X m" />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <p>Time goal</p>
                <div className="flex gap-1">
                  <input value={minutesAndSeconds.minutes} onChange={(e) => {setMinutesAndSeconds({...minutesAndSeconds, minutes: Number(e.target.value)});}} className="rounded-md w-1/2 text-black" type="number" placeholder="Min" />
                  <p>:</p>
                  <input value={minutesAndSeconds.seconds} onChange={(e) => {setMinutesAndSeconds({...minutesAndSeconds, seconds: Number(e.target.value)});}} className="rounded-md w-1/2 text-black" type="number" placeholder="Sec" />
                </div>
              </div>
            </div>
            <div>
              <p className="pb-2">Date of workout</p>
              <DatePicker selected={date} onChange={(date) => setDate(date ?? new Date())}  className="rounded-md text-black" />
            </div>
            {createScheduledWorkout.isPending ?
              <div className="flex bg-orange-600 p-2 mt-6 rounded-xl w-full justify-center">
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p> Processing...</p>
              </div>
              : <button onClick={scheduleWorkout} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-full">
                Schedule Workout 
              </button>
            }
            { scheduleWorkoutError ?
              <Alert variant="filled" severity="error" onClose={() => {setScheduleWorkoutError(false)}}>
                There are missing fields
              </Alert>
              : null
            }
          </div>
          : <div className="flex felx-col p-5 text-center gap-4 w-full">
            {Number.isNaN(editWorkout)? <div className="flex flex-col w-full gap-5">
              <p className="text-orange-300 text-2xl font-bold">{scheduledWorkouts.data[selected].name}</p>
              <div className="flex justify-between">
                <p>Date of Workout:</p>
                <p>{new Date(scheduledWorkouts.data[selected].dateOfWorkout).toISOString().slice(0,10)}</p>
              </div>
              <div className="flex justify-between">
                <p>Workout Distance:</p>
                <p>{scheduledWorkouts.data[selected].distance} Meters</p>
              </div>
              <div className="flex justify-between">
                <p>Time goal:</p>
                <p>{new Date(scheduledWorkouts.data[selected].timeGoal).toISOString().slice(11,19)}</p>
              </div>
              <div className="flex justify-center gap-2">
                <button className="bg-red-500 hover:bg-red-600 rounded-lg p-2 w-20">Delete</button>
                <button className="bg-orange-500 hover:bg-orange-600 rounded-lg p-2 w-20">Edit</button>
                <button className="bg-orange-500 hover:bg-orange-600 rounded-lg p-2 w-40">Start Workout</button>
              </div>
            </div>
            : <div>
              
            </div> }
          </div> 
        }
      </div>
    </div>
  )
}