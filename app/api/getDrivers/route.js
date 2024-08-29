import connectMongoDB from "@/libs/mongodb";
import Driver from "@/models/driver";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    try {
      const url = new URL(request.url);
      const city = url.searchParams.get("city");
      const limit = url.searchParams.get("limit") || 5;
  
      if (!city) {
        return NextResponse.json({ message: "City is required" }, { status: 400 });
      }
  
      await connectMongoDB();
  
      const drivers = await Driver.find({ currCity: city }).limit(Number(limit));
  
      return NextResponse.json({ drivers }, { status: 200 });
    } catch (error) {
      console.error("Error fetching drivers by city:", error);
      return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
  };