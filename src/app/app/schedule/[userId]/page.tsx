"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ScheduledWorkout from "@/components/ScheduledWorkout";

export default function App() {

  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [ mobileMenu, setMobileMenu] = useState(true);
  const [ selected, setSelected ] = useState(NaN);
  const [ name, setName ] = useState("");
  const [ distance, setDistance ] = useState(NaN);
  const [ date, setDate ] = useState(new Date());
  const [ timeGoal, setTimeGoal ] = useState(NaN);
  const [ editWorkout, setEditWorkout ] = useState(false);
  const [ scheduleWorkoutError, setScheduleWorkoutError ] = useState(false);
  const [ editWorkoutError, setEditWorkoutError] = useState(false);
  const [ scheduleWorkoutServerError, setScheduleWorkoutServerError] = useState(false);
  const [ scheduleWorkoutSuccess, setScheduleWorkoutSuccess] = useState(false);
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
      setScheduleWorkoutSuccess(true);
    },
    onError: () => {
      setScheduleWorkoutServerError(true);
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

  const clearScheduledWorkout = useMutation({
    mutationFn: () => api.deleteScheduledWorkout(scheduledWorkouts.data[selected].id),
    onSuccess: () => {
      queryClient.invalidateQueries(),
      setSelected(NaN);
      router.push('/app/workout/' + params.userId);
    }
  });

  const createOngoingWorkout = useMutation({
    mutationFn: () => api.createOngoingWorkout({
      name: scheduledWorkouts.data[selected].name,
      distance: scheduledWorkouts.data[selected].distance,
      timeGoal: scheduledWorkouts.data[selected].timeGoal,
      dateOfWorkout: scheduledWorkouts.data[selected].dateOfWorkout
    }),
    onSuccess: () => clearScheduledWorkout.mutate()
  });

  const deleteScheduledWorkout = useMutation({
    mutationFn: () => api.deleteScheduledWorkout(
      scheduledWorkouts.data[selected].id
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduledWorkouts"] });
      setSelected(NaN);
      window.location.reload;
    }
  });

  const editScheduledWorkout = useMutation({
    mutationFn: () => api.editScheduledWorkout({
      workoutId: scheduledWorkouts.data[selected].id,
      name: name,
      distance: distance,
      timeGoal: timeGoal,
      dateOfWorkout: date
    }),
    onSuccess: () => {
      setEditWorkout(false),
      setName(""),
      setDate(new Date()),
      setDistance(NaN),
      setMinutesAndSeconds({minutes: NaN, seconds: NaN}),
      queryClient.invalidateQueries();
    }
  });

  const sendEditWorkout = () => {
    if (name != scheduledWorkouts.data[selected].name ||
        distance != scheduledWorkouts.data[selected].distance ||
        date != scheduledWorkouts.data[selected].name ||
        minutesAndSeconds) {
      setTimeGoal(minutesAndSeconds.minutes*60000 + minutesAndSeconds.seconds*1000);
      editScheduledWorkout.mutate();
    } else {
      setEditWorkoutError(true);
    }
  }

  return(
    <div className="flex w-full mt-5">
      <div className={`flex flex-col md:w-1/3  ${mobileMenu ? '' : 'max-sm:hidden'}`}>
        <button onClick={() => {
          setSelected(NaN), 
          setMobileMenu(false),
          setEditWorkout(false),
          setName(""),
          setDate(new Date()),
          setDistance(NaN),
          setMinutesAndSeconds({minutes: NaN, seconds: NaN}),
          setEditWorkoutError(false);
        }} className="flex bg-orange-500 hover:bg-orange-600 p-2 rounded-xl m-2 justify-center">
          <p>New Workout</p> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <div>
          {scheduledWorkouts.isLoading ? <>
            {[...Array(3)].map((workoutSkeleton: any, index: any) => 
              <div key={index} className="animate-pulse flex flex-col bg-gray-900 rounded-lg m-2 p-4">
                <div className="w-1/2 rounded-full bg-orange-300 p-3 m-1" />
                <div className="w-2/3 rounded-full bg-gray-500 p-1 m-1"/>
              </div>
            )}
          </> : null}
          {scheduledWorkouts.isSuccess ? <>
            {scheduledWorkouts.data.length ? <>
              {scheduledWorkouts.data.map((workout: any, index: any) => (
                <button onClick={() => {setSelected(index), setMobileMenu(false)}}>
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
      <div className={`flex flex-col md:w-2/3 bg-gray-900 m-1 rounded-md ${mobileMenu ? 'max-sm:hidden' : ''}`}>
        <button onClick={() => setMobileMenu(true)} className="md:hidden m-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
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
              <DatePicker selected={date} onChange={(date) => setDate(date ?? new Date())} dateFormat={"dd/MM/yyyy"} className="rounded-md text-black" />
            </div>
            {createScheduledWorkout.isPending ?
              <div className="flex bg-orange-600 p-2 mt-6 rounded-xl w-full justify-center">
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p> Processing...</p>
              </div>
            : 
              <button onClick={scheduleWorkout} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-full">
                Schedule Workout 
              </button>
            }
            { scheduleWorkoutError ?
              <Alert variant="filled" severity="error" onClose={() => {setScheduleWorkoutError(false)}}>
                There are missing fields
              </Alert>
            : 
              null
            }
            { scheduleWorkoutServerError ?
              <Alert variant="filled" severity="error" onClose={() => {setScheduleWorkoutServerError(false)}}>
                Something went wrong
              </Alert>
            : 
              null
            }
            { scheduleWorkoutSuccess ?
              <Alert variant="filled" severity="success" onClose={() => {setScheduleWorkoutSuccess(false)}}>
                Your workout have been scheduled
              </Alert>
            : 
              null
            }
          </div>
        : 
          <div className="flex felx-col p-5 text-center gap-4 w-full">
            { editWorkout ? 
              <div className="flex flex-col w-full gap-5">
                <input value={name} onChange={(e) => setName(e.target.value)} className="text-orange-400 text-2xl font-bold rounded-md"></input>
                <div className="flex justify-between">
                  <p>Date of Workout:</p>
                  <DatePicker selected={date} onChange={(date) => setDate(date ?? new Date())} dateFormat={"yyyy/MM/dd"} className="rounded-md text-black" />
                </div>
                <div className="flex justify-between">
                  <p>Workout Distance:</p>
                  <input value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="rounded-md text-black"></input>
                </div>
                <div className="flex justify-between">
                  <p>Minutes:</p>
                  <input value={minutesAndSeconds.minutes} onChange={(e) => setMinutesAndSeconds({...minutesAndSeconds, minutes: Number(e.target.value)})} className="rounded-md text-black"></input>
                </div>
                <div className="flex justify-between">
                  <p>Seconds:</p>
                  <input value={minutesAndSeconds.seconds} onChange={(e) => setMinutesAndSeconds({...minutesAndSeconds, seconds: Number(e.target.value)})} className="rounded-md text-black"></input>
                </div>
                <div className="flex justify-center gap-2">
                  <button onClick={() => {
                    setEditWorkout(false),
                    setName(""),
                    setDate(new Date()),
                    setDistance(NaN),
                    setMinutesAndSeconds({minutes: NaN, seconds: NaN}),
                    setEditWorkoutError(false)}
                  } className="bg-red-500 hover:bg-red-600 rounded-lg p-2">Cancel</button>
                  <button onClick={() => sendEditWorkout()} className="bg-orange-500 hover:bg-orange-600 rounded-lg p-2">
                    {editScheduledWorkout.isPending ? 
                      <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    : <> Save Edit </> }
                  </button>
                </div>
                { editWorkoutError ?
                  <Alert variant="filled" severity="error" onClose={() => {setScheduleWorkoutError(false)}}>
                    You have made no edits!
                  </Alert>
                : 
                  null
                }
              </div> 
            :
              <div className="flex flex-col w-full gap-5">
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
                  <button onClick={() => deleteScheduledWorkout.mutate()} className="bg-red-500 hover:bg-red-600 rounded-lg p-2 w-20">
                    {deleteScheduledWorkout.isPending ? 
                      <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    : <> Delete </> }
                  </button>
                  <button onClick={() => {
                    setEditWorkout(true), 
                    setDate(scheduledWorkouts.data[selected].dateOfWorkout), 
                    setName(scheduledWorkouts.data[selected].name), 
                    setDistance(scheduledWorkouts.data[selected].distance), 
                    setMinutesAndSeconds({
                      minutes: Math.floor(scheduledWorkouts.data[selected].timeGoal/60000),
                      seconds: (scheduledWorkouts.data[selected].timeGoal%60000)/1000
                    })}
                  } className="bg-orange-500 hover:bg-orange-600 rounded-lg p-2 w-20">Edit</button>
                  <button onClick={() => createOngoingWorkout.mutate()} className="bg-orange-500 hover:bg-orange-600 rounded-lg p-2 w-40">
                    {createOngoingWorkout.isPending || clearScheduledWorkout.isPending ? <>
                      <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    </> : "Start Workout" }
                  </button>
                </div>
              </div>
            }
          </div> 
        }
      </div>
    </div>
  )
}