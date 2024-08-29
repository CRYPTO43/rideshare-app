import connectMongoDB from "@/libs/mongodb";
import Driver from "@/models/driver";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Parse the request body to get driver details
    const { name,email,pass, rating, rides, isOnline, isOnRide, currCity, currLan, currLon } = await request.json();

    // Connect to MongoDB
    await connectMongoDB();

    // Create a new driver in the database
    const newDriver = await Driver.create({ name,email,pass, rating, rides, isOnline, isOnRide, currCity, currLan, currLon });

    // Return success response
    return NextResponse.json({ message: "Driver created successfully", driver: newDriver }, { status: 201 });
  } catch (error) {
    // Log the error and return a 500 response
    console.error("Error creating driver:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    // Parse query params from request URL
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongoDB();

    // Find the driver by email
    const driver = await Driver.findOne({ email });

    if (!driver) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    // Return the driver's email and password
    return NextResponse.json({ email: driver.email, password: driver.pass }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving driver login info:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
};

