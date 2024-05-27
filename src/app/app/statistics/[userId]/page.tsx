"use client";

import { useSession } from "next-auth/react";


export default function Statistics () {

  const { data: session } = useSession();

  return(
    <p>Statistics test</p>
  );
}