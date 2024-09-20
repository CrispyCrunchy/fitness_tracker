"use client";

import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Alert } from "@mui/material";
import Link from "next/link";

export default function Home() {

  const user = useQuery({
    queryKey: ["user"],
    queryFn: api.getCurrentUser
  });

  var totalDistance = 0;
  var totalTime = 0;

  Number.prototype.padLeft = function(base: any, chr: any) {
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }

  return (
    <div>
      <div className="flex m-5 bg-gray-800 rounded-full">
        {user.isLoading ? (
          <div className="flex">
            <div className="rounded-full h-24 w-24 m-2 bg-gray-500" />
            <div className="flex flex-col justify-evenly">
              <p className="ml-5 h-8 lg:w-40 w-24 rounded-full bg-orange-400" />
              <p className="ml-5 h-5 lg:w-52 w-28 rounded-full bg-gray-500" />
            </div>
          </div>
        ) : <>
          {user.isSuccess ? <>
            <img src={user.data.image} className="rounded-full w-24 m-2" />
            <div className="flex flex-col justify-evenly">
              <p className="ml-5 lg:text-3xl text-2xl font-bold text-orange-400">{user.data.name}</p>
              <p className="ml-5 lg:text-2xl text-xs italic">{user.data.email}</p>
            </div>
          </> : null}
        </>}
      </div>
      <div className="flex max-lg:flex-col bg-gray-800 mx-5 rounded-xl">
        <div className="flex w-full lg:w-1/2">
          <p className="p-5 lg:w-2/3 w-3/4">
            Total distance:
          </p>
          <div className="bg-black my-2 p-2 rounded-md mr-5 lg:w-1/3 w-1/4">
            {user.isSuccess ?
              <>
                {user.data.completedWorkouts.forEach((workout: { distance: number; }) => {
                  totalDistance += workout.distance;
                }, totalDistance)}
                {(totalDistance/1000).toFixed(1)} km
              </>
            : null}
          </div>
        </div>
        <div className="flex w-full lg:w-1/2">
          <p className="p-5 lg:w-1/2 w-2/3">
            Total time:
          </p>
          <div className="bg-black my-2 p-2 rounded-md mr-2 lg:w-1/2 w-1/3">
            {user.isSuccess ?
              <>
                {user.data.completedWorkouts.forEach((workout: { compleationTime: number; }) => {
                  totalTime += workout.compleationTime;
                }, totalTime)}
                {Math.floor(totalTime/360000).padLeft()}:{Math.floor((totalTime%360000)/6000).padLeft()}:{Math.floor(((totalTime%360000)%6000)/100).padLeft()},{(((totalTime%360000)%6000)%100).padLeft()}
              </>
            : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        { user.isLoading ?
          <div className="flex bg-gray-900 rounded-xl m-5">
            <p className="bg-gray-500 p-2 w-full m-5 rounded-full" />
            <div className="justify-end w-36 bg-orange-500 hover:bg-orange-600 rounded-xl p-3 mt-5 mb-5 mr-5 h-8" />
          </div>
          : 
          <div className="flex bg-gray-900 rounded-xl m-5">
            {user.data.scheduledWorkouts.length ? <>
              <p className="m-5 w-full">You have {user.data.scheduledWorkouts.length} scheduled workouts</p>
              <Link href={"/app/schedule/" + user.data.id} className="justify-end w-52 bg-orange-500 hover:bg-orange-600 rounded-xl p-2 mt-auto mb-auto mr-5 text-center">Start!</Link>
            </> : <>
              <p className="m-5 w-full">You don't have any scheduled workouts</p>
              <Link href={"/app/schedule/" + user.data.id} className="justify-end w-52 bg-orange-500 hover:bg-orange-600 rounded-xl p-2 mt-auto mb-auto mr-5 text-center">Schedule Now</Link>
            </>}
          </div>
        }
        { user.isLoading ?
          <div className="flex bg-gray-900 rounded-xl mr-5 ml-5 mb-5">
            <p className="bg-gray-500 p-2 w-full m-5 rounded-full" />
            <div className="justify-end w-36 bg-orange-500 hover:bg-orange-600 rounded-xl p-3 mt-5 mb-5 mr-5 h-8" />
          </div>
          :
          <div className="flex bg-gray-900 rounded-xl mr-5 ml-5 mb-5">
            {user.data.completedWorkouts.length ? <>
              <p className="m-5 w-full">You have {user.data.completedWorkouts.length} completed workouts</p>
              <Link href={"/app/history/" + user.data.id} className="justify-end w-52 bg-orange-500 hover:bg-orange-600 rounded-xl p-2 mt-auto mb-auto mr-5 text-center">Take a look</Link>
            </> : <>
              <p className="m-5 w-full">You don't have any completed workouts</p>
              <Link href={"/app/schedule/" + user.data.id} className="justify-end w-52 bg-orange-500 hover:bg-orange-600 rounded-xl p-2 mt-auto mb-auto mr-5 text-center">Get Started</Link>
            </>}
          </div>
        }
      </div>
        
    </div>
  );
}