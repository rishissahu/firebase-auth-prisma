"use client";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

const Profile: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [addressDetails, setAddressDetails] = useState({
    pincode: "",
    city: "",
    floor: "",
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries: ["places"],
  });

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setLocation({ lat, lng });
    } catch (error) {
      console.error("Error fetching geocode: ", error);
    }
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location: ", error)
      );
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Input
        placeholder="Enter your place"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
      />
      {status === "OK" &&
        data.map(({ place_id, description }) => (
          <div
            key={place_id}
            onClick={() => handleSelect(description)}
            style={{ cursor: "pointer", margin: "5px 0" }}
          >
            {description}
          </div>
        ))}

      <Button onClick={fetchLocation} style={{ marginTop: "10px" }}>
        Get My Location
      </Button>

      {location && (
        <GoogleMap
          center={location}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "400px", marginTop: "20px" }}
        >
          <MarkerF position={location} />
        </GoogleMap>
      )}

      {location && (
        <div style={{ marginTop: "20px" }}>
          <Input
            placeholder="Pincode"
            value={addressDetails.pincode}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, pincode: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="City"
            value={addressDetails.city}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, city: e.target.value })
            }
            style={{ marginBottom: "10px" }}
          />
          <Input
            placeholder="Floor/Apartment"
            value={addressDetails.floor}
            onChange={(e) =>
              setAddressDetails({ ...addressDetails, floor: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
