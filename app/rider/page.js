"use client";

import RideSearch from "@/components/RideSearch/RideSearch";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState, useRef } from "react";

const Rider = () => {
  const google_API = "AIzaSyBDV9GILWT9oHP0a1nJfAVZXd_OFgffeAM";

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [destination, setDestination] = useState(""); // State for destination address
  const [destLocation, setDestLocation] = useState({ lat: null, lng: null }); // State for destination lat/lng
  const [eta, setEta] = useState(null); // ETA between rider and destination
  const [loading, setLoading] = useState(false); // Loading state
  const autocompleteRef = useRef(null);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          localStorage.setItem("currLat", JSON.stringify(position.coords.latitude));
          localStorage.setItem("currLon", JSON.stringify(position.coords.longitude));
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Reverse geocode to get city and address
  useEffect(() => {
    if (location.lat && location.lng) {
      const loader = new Loader({
        apiKey: google_API,
        version: "weekly",
        libraries: ["places"], // Add 'places' for autocomplete
      });

      loader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: location.lat, lng: location.lng };

        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const addressComponents = results[0].address_components;
              const formattedAddress = results[0].formatted_address;
              setAddress(formattedAddress);
              const cityComponent = addressComponents.find((component) =>
                component.types.includes("locality")
              );

              if (cityComponent) {
                setCity(cityComponent.long_name);
                localStorage.setItem("currCity", JSON.stringify(cityComponent.long_name));
              } else {
                setError("City not found");
              }
            } else {
              setError("No results found");
            }
          } else {
            setError(`Geocoder failed due to: ${status}`);
          }
        });
      });
    }
  }, [location]);

  // Initialize Google Places Autocomplete for destination search
  useEffect(() => {
    const loader = new Loader({
      apiKey: google_API,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ["geocode"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setDestination(place.formatted_address); // Set the selected destination address
          setDestLocation({ lat, lng }); // Set the destination lat and lng
        }
      });
    });
  }, []);

  // Function to calculate ETA using the backend API
  const calculateETA = async () => {
    if (location.lat && location.lng && destLocation.lat && destLocation.lng) {
      setLoading(true); // Set loading to true before calling the API

      const origins = `${location.lat},${location.lng}`;
      const destinations = `${destLocation.lat},${destLocation.lng}`;

      try {
        const response = await fetch("/api/calculateEta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ origins, destinations }),
        });

        const data = await response.json();

        if (response.ok && data.data.rows[0].elements[0].status === "OK") {
          setEta({
            distance: data.data.rows[0].elements[0].distance.text,
            duration: data.data.rows[0].elements[0].duration.text,
          });
        } else {
          setError("Failed to calculate ETA");
        }
      } catch (err) {
        setError("Error calculating ETA");
      } finally {
        setLoading(false); // Set loading to false after the API call is complete
      }
    }
  };

  // Calculate ETA when destination changes
  useEffect(() => {
    if (destLocation.lat && destLocation.lng) {
      calculateETA();
    }
  }, [destLocation]);

  return (
    <>
      <p>You are currently in: {city}</p>
      <p>Your current address: {address}</p>

      {/* Destination Search Bar */}
      <div>
        <input
          type="text"
          ref={autocompleteRef} // Reference to autocomplete input
          placeholder="Enter your destination"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {loading && <p>Loading ETA...</p>}

      <p>Your destination: {destination}</p>

      {/* Show ETA once destination is set */}
      {eta && (
        <div>
          <p>Distance to destination: {eta.distance}</p>
          <p>Estimated time: {eta.duration}</p>
        </div>
      )}

      {/* Render RideSearch only if destination is set */}
      {destLocation.lat && destLocation.lng && (
        <RideSearch
          currentCity={city}
          destination={destLocation}
          curCoords={location}
          destEta={eta} // Pass the ETA data to RideSearch
        />
      )}
    </>
  );
};

export default Rider;
