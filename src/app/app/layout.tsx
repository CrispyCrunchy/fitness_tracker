import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";
import NewWorkout from "@/components/NewWorkout";
import History from "@/components/History";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/');
  }

  return(
    <div>
      <div className="sm:grid sm:max-lg:grid-cols-4 lg:grid-cols-6 lg:min-h-screen lg:h-full">
        <div className="max-lg:hidden lg:bg-gray-900"></div>
        <div className="max-lg:hidden lg:col-span-2">
          <NewWorkout />
        </div>
        <div className="lg:hidden"></div>
        <div className="lg:hidden sm:col-span-2">
          {children}
        </div>
        <div className="lg:hidden"></div>
        <div className="max-lg:hidden lg:col-span-2">
          <History />
        </div>
        <div className="max-lg:hidden lg:bg-gray-900"></div>
      </div>
      <div className="lg:hidden">
        <Navigation />
      </div>
    </div>
  );
}