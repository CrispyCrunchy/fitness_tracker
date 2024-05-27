"use client";

import { useSession } from "next-auth/react";


export default function History () {

  const { data: session } = useSession();

  return(
    <p>History test</p>
  );
}