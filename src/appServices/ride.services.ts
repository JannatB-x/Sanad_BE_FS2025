import { Client } from "@googlemaps/google-maps-services-js";
import dotenv from "dotenv";
dotenv.config();

const mapsClient = new Client({});

interface Location {
  lat: number;
  lng: number;
}

interface DistanceResult {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  status: string;
}

export const getDistance = async (
  origin: string | Location,
  destination: string | Location
): Promise<DistanceResult> => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is not set in environment variables"
      );
    }

    const originStr =
      typeof origin === "string" ? origin : `${origin.lat},${origin.lng}`;
    const destinationStr =
      typeof destination === "string"
        ? destination
        : `${destination.lat},${destination.lng}`;

    const response = await mapsClient.distancematrix({
      params: {
        origins: [originStr],
        destinations: [destinationStr],
        key: apiKey,
      },
    });

    const element = response.data.rows[0].elements[0];
    if (element.status !== "OK") {
      throw new Error(`Distance calculation failed: ${element.status}`);
    }

    return element as DistanceResult;
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw error;
  }
};

export const getGeocode = async (address: string): Promise<Location> => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_MAPS_API_KEY is not set in environment variables"
      );
    }

    const response = await mapsClient.geocode({
      params: {
        address,
        key: apiKey,
      },
    });

    if (response.data.results.length === 0) {
      throw new Error(`No results found for address: ${address}`);
    }

    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }
};
