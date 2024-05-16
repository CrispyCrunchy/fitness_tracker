"use client";

import api from "@/lib/axios";
import { useSession } from "next-auth/react";

export default function App() {

  const { data: session } = useSession();

  return (
    <></>
  );
}