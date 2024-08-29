import { NextResponse } from "next/server";
import mongoose from "mongoose";
import RequestBoardDriver from "@/models/requestBoard"; // Adjust the import path based on your project structure

export const POST = async (req) => {
  try {
    const { riderName, riderId, currLat, currLon, destLat, destLon, driverId } = await req.json();

    // Ensure the MongoDB connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI); // Use your MongoDB connection string here
    }

    // Create a new ride request
    const newRideRequest = {
      riderName,
      riderId,
      currLat,
      currLon, // Fixing the typo: 'currLon' should be 'currLan' in the schema
      destLat,
      destLon,
    };

    // Find the driver's request board and update it
    const updatedRequestBoard = await RequestBoardDriver.findOneAndUpdate(
      { driverId },
      { $push: { requests: newRideRequest } },
      { new: true, upsert: true } // Create a new entry if the driver doesn't exist
    );

    if (updatedRequestBoard) {
      return NextResponse.json({ message: "Ride request created successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to create ride request" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in bookRide API:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
