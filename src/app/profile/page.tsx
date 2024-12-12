"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import {
  useLoadScript,
  GoogleMap,
  MarkerF,
  Libraries,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Script from "next/script";

const libraries: Libraries = ["places"];

const Profile: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [addressDetails, setAddressDetails] = useState({
    pincode: "",
    city: "",
    floor: "",
  });

  useEffect(() => {
    <Script
      defer
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
    />;
  }, []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries,
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

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex gap-4 items-center">
        <Button className="px-10" onClick={fetchLocation}>
          Fetch my current Location
        </Button>
        <div className="relative w-full">
          <Input
            placeholder="Enter your place"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
          />
          {status === "OK" && (
            <div className="absolute top-10 z-10 bg-white p-3">
              {data.map(({ place_id, description }, index) => (
                <div
                  className=""
                  key={place_id}
                  onClick={() => handleSelect(description)}
                  style={{ cursor: "pointer", margin: "5px 0" }}
                >
                  {description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {location && (
        <GoogleMap
          center={location ?? ""}
          zoom={15}
          mapContainerStyle={{
            width: "100%",
            height: "400px",
            marginTop: "20px",
          }}
        >
          <MarkerF position={location} draggable onDragEnd={onMarkerDragEnd} />
        </GoogleMap>
      )}

      {location && (
        <div
          className="w-1/3 flex flex-col items-start gap-5"
          style={{ marginTop: "20px" }}
        >
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
          <Button>Save Adress</Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
