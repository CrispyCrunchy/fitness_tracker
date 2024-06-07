"use client";

import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function App() {

  const queryClient = useQueryClient();
  const [ ongoingWorkout, setOngoingWorkout ] = useState(false);

  //StopWatch
  const [ time, setTime ] = useState(0);
  const [ isRunning, setIsRunning ] = useState(false);

  useEffect (() => {
    let intervalId: any;
    if (isRunning) {
      //Incrementing time by 1 everty 10 milliseconds 
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
      setOngoingWorkout(false);
    } else {
      setTime(0);
    }
  }

  //post data
  const [ name, setName ] = useState("")
  const [ distance, setDistance ] = useState(NaN);
  const [ date, setDate ] = useState(new Date());
  const [ timeGoal, setTimeGoal ] = useState(NaN);  
  const [ minutesAndSeconds, setMinutesAndSeconds ] = useState({
    minutes: NaN,
    seconds: NaN
  });

  const createWorkout = useMutation({
    mutationFn: () => api.createWorkout({ 
      name: name,
      distance: distance,
      timeGoal: timeGoal,
      dateOfWorkout: date,
      compleationTime: time 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      setOngoingWorkout(false);
      setName("");
      setDistance(NaN);
      setDate(new Date());
      setTimeGoal(NaN);
      setMinutesAndSeconds({minutes: NaN, seconds: NaN});
      setTime(0);
      setIsRunning(false);
    }
  });

  //Start workout call 
  const startWorkout = () => {
    if (name && distance && minutesAndSeconds && date) {
      setTimeGoal(minutesAndSeconds.minutes*6000 + minutesAndSeconds.seconds*100);
      setOngoingWorkout(true);
    } /*else {
      error message here
    }*/
  }

  return (
    <div>
      <div className="flex justify-center mt-5">
        <h1 className="text-4xl font-bold italic pb-3 pt-2">STRIVER</h1>
        <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-16" />
      </div>
      {ongoingWorkout ? ( 
        <div className="flex flex-col p-5 text-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Your Workout: {name}</h2>
            
            <div className="flex justify-center gap-8 mt-5">
              <div>
                <h3 className="font-bold">Distance:</h3>
                <p>{distance} meters</p>
              </div>
              <div>
                <h3 className="font-bold">Time Goal:</h3>
                <p>{minutesAndSeconds.minutes}:{minutesAndSeconds.seconds}</p>
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
              <button onClick={() => createWorkout.mutate()} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-20">Finish</button>
            </div>
          </div>  
        </div>
      ) : (
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
          <div>
            <button onClick={startWorkout} className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-full">Schedule Workout</button>
          </div>
        </div>
      )}
    </div>
  );
}