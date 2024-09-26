import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST (request: NextRequest) {
  
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const postData = await request.json();

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

    await prisma.ongoingWorkout.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        },
        name: postData.name,
        distance: postData.distance,
        timeGoal: postData.timeGoal,
        dateOfWorkout: postData.dateOfWorkout,
      }
    });

    return NextResponse.json({ message: "Successfully started workout!" }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error!"}, { status: 500 });
  }
}