import { NextResponse } from "next/server";
import { seedFirestore } from "@/lib/firebase/firestore";

export async function GET() {
  const result = await seedFirestore();
  return NextResponse.json(result);
}

export async function POST() {
  const result = await seedFirestore();
  return NextResponse.json(result);
}
