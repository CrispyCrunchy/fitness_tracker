import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navigation from "@/components/Navigation";

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
      <div>
        {children}
      </div>
      <div>
        <Navigation />
      </div>
    </div>
  );
}