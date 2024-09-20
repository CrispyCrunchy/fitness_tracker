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

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email ?? "" },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    const workout = await prisma.scheduledWorkout.findUnique({
      where: { id: workoutId },
      include: {
        name: true,
        distance: true,
        timeGoal: true,
        dateOfWorkout: true
      }
    });

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error!"}, { status: 500 });
  }
}