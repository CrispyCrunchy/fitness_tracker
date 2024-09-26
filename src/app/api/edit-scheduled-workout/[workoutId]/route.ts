import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";


export async function PUT ( request: NextRequest, { params }: { params: { workoutId: string }} ) {
  
  try {
    const session = await getServerSession(authOptions);
    const workoutId = params.workoutId;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const postData = await request.json();

    if (!postData.workoutId) {
      return NextResponse.json({ message: "No worrkout Id given"}, { status: 400 });
    }

    if (!postData.name) {
      return NextResponse.json({ message: "Workout not named" }, { status: 400 });
    }

    if (!postData.distance) {
      return NextResponse.json({ message: "No distance set for workout" }, { status: 400 });
    }

    if (!postData.timeGoal) {
      return NextResponse.json({ message: "No time goal set for workout" }, { status: 400 });
    }

    if (!postData.dateOfWorkout) {
      return NextResponse.json({ message: "No date set for workout" }, { status: 400 });
    }

    const workout = await prisma.scheduledWorkout.update({
      where: { id: workoutId },
      data: {
        name: postData.name,
        distance: postData.distance,
        timeGoal: postData.timeGoal,
        dateOfWorkout: postData.dateOfWorkout
      }
    });

    return NextResponse.json(workout, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error!"}, { status: 500 });
  }
}