import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "LocalLoop Integrated Engine is running smoothly",
    version: "1.0",
    timestamp: new Date().toISOString()
  });
}
