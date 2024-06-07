import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { userId: string }}) {
  
  const session = await getServerSession(authOptions);
  const userId = params.userId;
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return NextResponse.json({ message: "User could not be found" }, { status: 404 });
  }
  
  const workouts = await prisma.workout.findMany({
    where: { userId: userId },
    orderBy: { dateOfWorkout: 'desc'}
  })

  if (!workouts) {
    return NextResponse.json({ message: "No completed workouts found" }, { status: 404 });
  }

    return NextResponse.json(workouts, { status: 200 });
}