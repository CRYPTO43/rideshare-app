import { NextResponse } from "next/server";
import mongoose from "mongoose";
import RequestBoardDriver from "@/models/requestBoard"; // Adjust the import path based on your project structure

export const POST = async (req) => {
  try {
    const { driverId } = await req.json();

    // Ensure the MongoDB connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URI); // Use your MongoDB connection string here
    }

    // Create a new request board for the driver
    const newRequestBoard = {
      driverId,
      requests: [], // Initialize with an empty array of requests
    };

    // Insert the new request board into the database
    const savedRequestBoard = await RequestBoardDriver.findOneAndUpdate(
      { driverId },
      newRequestBoard,
      { new: true, upsert: true } // Create if doesn't exist, otherwise update
    );

    if (savedRequestBoard) {
      return NextResponse.json({ message: "Request board created successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to create request board" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in requestBoard API:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
