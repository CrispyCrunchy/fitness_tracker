"use client";

import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";


export default function App() {

  const { data: session } = useSession();

  
  const [ postData, setPostData ] = useState({
    name: "",
    distance: 0,
    timeGoal: 0,
    dateOfWorkout: new Date(0),
    compleationTime: 0
  });

  const createWorkout = useMutation({
    mutationFn: () => api.createWorkout({ 
      name: postData.name,
      distance: postData.distance,
      timeGoal: postData.timeGoal,
      dateOfWorkout: postData.dateOfWorkout,
      compleationTime: postData.compleationTime  
    }) 
  });

  return (
    <div className="flex flex-col p-5 text-center gap-4">
      <div className="flex justify-center">
        <p className="text-4xl font-bold italic pb-3 pt-2">STRIVER</p>
        <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-16" />
      </div>
      <div className="flex flex-col gap-1 pt-4">
        <p className="">Name your workout</p>
        <input value={postData.name} onChange={(e) => {setPostData({...postData, name: e.target.value});}} className="rounded-md text-black" placeholder=" Workout"/>
      </div>
      <div className="flex flex-row gap-3">
        <div className="flex flex-col gap-2 w-1/2">
          <p className="">Distance</p>
          <input value={postData.distance} onChange={(e) => {setPostData({...postData, distance: Number(e.target.value)});}} className="rounded-md text-black" type="number" placeholder="X.Y km" id="kilometer" />
        </div>
        <div className="flex flex-col gap-2 w-1/2">
          <p>Time goal</p>
          <div className="flex gap-1">
            <input className="rounded-md w-1/2 text-black" type="number" placeholder="Min" />
            <p>:</p>
            <input className="rounded-md w-1/2 text-black" type="number" placeholder="Sec" />
          </div>
        </div>
      </div>
      <div>
        <p className="pb-2">Date of workout</p>
        <input className="rounded-md text-black" type="date" />
      </div>
      <div>
        <button className="bg-orange-500 hover:bg-orange-600 p-2 mt-6 rounded-xl w-full">Start Workout</button>
      </div>
    </div>
  );
}