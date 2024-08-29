"use client";

import { Box, Button, List } from "@mui/material";
import AvailableRider from "../AvailableRider/AvailableRider";
import { useState, useEffect } from "react";

const RideSearch = (props) => {
  const [driverList, setDriverList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch drivers and calculate ETA
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true); // Set loading state to true when fetching begins
      try {
        const response = await fetch(`/api/getDrivers?city=${props.currentCity}&limit=5`);
        if (response.ok) {
          const data = await response.json();

          if (data.drivers.length > 0) {
            // Save the fetched drivers first
            const initialDrivers = data.drivers;

            // After fetching drivers, calculate ETA if rider coordinates and destination ETA are available
            if (props.curCoords && props.destEta) {
              const origins = `${props.curCoords.lat},${props.curCoords.lng}`;
              const destinations = data.drivers
                .map((driver) => `${driver.currLan},${driver.currLon}`)
                .join("|");

              // Call the backend to calculate ETA
              const etaResponse = await fetch("/api/calculateEta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ origins, destinations }),
              });

              if (etaResponse.ok) {
                const etaData = await etaResponse.json();

                // Update drivers with ETA and distance
                const updatedDrivers = initialDrivers.map((driver, index) => {
                  const driverEta = etaData.data.rows[0].elements[index]?.duration.text || "N/A";
                  const driverDistance = etaData.data.rows[0].elements[index]?.distance.text || "N/A";

                  const totalEta = combineEta(driverEta, props.destEta.destTime);
                  const totalDistance = combineDistance(driverDistance, props.destEta.destDis);

                  return {
                    ...driver,
                    eta: driverEta,
                    distance: driverDistance,
                    totalEta,
                    totalDistance,
                  };
                });

                setDriverList(updatedDrivers); // Set driverList with ETA and distance
              } else {
                console.error("Failed to calculate ETA");
                setError("Failed to calculate ETA");
                setDriverList(initialDrivers); // Fallback to initial drivers if ETA fails
              }
            } else {
              setDriverList(initialDrivers); // If no rider coordinates or destination ETA, just show drivers
            }
          } else {
            setDriverList([]);
          }
        } else {
          setError("Failed to fetch drivers");
        }
      } catch (error) {
        setError("Error fetching drivers");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    if (props.currentCity) {
      fetchDrivers();
    }
  }, [props.currentCity, props.curCoords, props.destEta]);

  // Helper function to combine ETA times
  const combineEta = (driverEta, destinationEta) => {
    if (!driverEta || !destinationEta) return driverEta || destinationEta || "N/A";
    const driverTime = parseInt(driverEta.split(" ")[0], 10);
    const destTime = parseInt(destinationEta.split(" ")[0], 10);
    return isNaN(driverTime) || isNaN(destTime)
      ? "N/A"
      : `${driverTime + destTime} min`; // Assuming the ETA is in minutes
  };

  // Helper function to combine distances
  const combineDistance = (driverDistance, destinationDistance) => {
    if (!driverDistance || !destinationDistance) return driverDistance || destinationDistance || "N/A";
    const driverDist = parseFloat(driverDistance.split(" ")[0]);
    const destDist = parseFloat(destinationDistance.split(" ")[0]);
    return isNaN(driverDist) || isNaN(destDist)
      ? "N/A"
      : `${(driverDist + destDist).toFixed(2)} km`; // Assuming the distance is in kilometers
  };

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <h3>Loading drivers...</h3>
      ) : driverList.length > 0 ? (
        <List>
          <Button>Auto Assign</Button>
          {driverList.map((driver, index) => (
            <AvailableRider key={index} driverData={driver} />
          ))}
        </List>
      ) : (
        <h3>No Drivers nearby.</h3>
      )}
    </>
  );
};

export default RideSearch;
