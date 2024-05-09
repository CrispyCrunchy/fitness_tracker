"use client";

import Link from "next/link";

export default function Navigation () {
  return (
    <>
      <Link href={"/"}>Workout</Link>
      <Link href={"/"}>History</Link>
      <Link href={"/"}>Statistics</Link>
    </>
  );
}