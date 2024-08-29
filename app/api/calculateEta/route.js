import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { origins, destinations } = await req.json();
    const google_API = "AIzaSyBDV9GILWT9oHP0a1nJfAVZXd_OFgffeAM"; // Google API Key

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origins}&destinations=${destinations}&key=${google_API}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to calculate distance and ETA" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};