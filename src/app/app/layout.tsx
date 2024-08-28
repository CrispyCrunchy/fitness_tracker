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
      <div className="grid lg:grid-cols-5 min-h-screen">
        <div className="col-span-1 max-lg:hidden bg-gray-900"></div>
        <div className="lg:col-span-3">
          <div className="flex justify-center mt-16">
            <h1 className="text-4xl font-bold italic pb-3 pt-2">STRIVER</h1>
            <img src="https://www.pngall.com/wp-content/uploads/12/Running-PNG-Pic.png" className="w-16" />
          </div>
          {children}
        </div>
        <div className="col-span-1 max-lg:hidden bg-gray-900"></div>
      </div>
      <div>
        <Navigation />
      </div>
    </div>
  );
}