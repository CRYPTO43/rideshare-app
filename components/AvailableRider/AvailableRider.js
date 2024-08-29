import { ListItem, Button } from "@mui/material";
import { useState } from "react";

const AvailableRider = (props) => {
  const [bookingStatus, setBookingStatus] = useState(null); // Track booking status

  const handleBookClick = async () => {
    console.log("clciked")
    const bookingData = {
      riderName: "test rider", // Replace with actual rider name or fetch from props/context
      riderId: "6969", // Replace with actual rider ID or fetch from props/context
      currLat: props.driverData.currLat,
      currLan: props.driverData.currLan,
      destLat: props.driverData.destLat,
      destLon: props.driverData.destLon,
    };

    try {
      const response = await fetch("/api/bookRide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setBookingStatus("Booking successful!");
      } else {
        setBookingStatus("Failed to book ride.");
      }
    } catch (error) {
      setBookingStatus("Error booking ride.");
    }
  };

  return (
    <ListItem>
      <p>Driver Name: {props.driverData.name}</p>
      <p>Driver Rating: {props.driverData.rating}</p>
      <p>Distance from You: {props.driverData.distance}</p>
      <p>Total time to destination: {props.driverData.totalEta}</p>
      <Button variant="contained" color="primary" onClick={handleBookClick}>
        Book
      </Button>
      {bookingStatus && <p>{bookingStatus}</p>}
    </ListItem>
  );
};

export default AvailableRider;
