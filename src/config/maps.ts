import { Client } from "@googlemaps/google-maps-services-js";
import { config } from "./environment";

// Initialize Google Maps client
export const mapsClient = new Client({});

// Helper to get distance and duration
export const getDistanceMatrix = async (
  origin: string,
  destination: string
) => {
  try {
    const response = await mapsClient.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: config.googleMaps.apiKey,
      },
    });

    const element = response.data.rows[0].elements[0];

    return {
      distance: element.distance.value / 1000, // meters to km
      duration: element.duration.value / 60, // seconds to minutes
      distanceText: element.distance.text,
      durationText: element.duration.text,
    };
  } catch (error) {
    console.error("Maps API error:", error);
    throw error;
  }
};

// Helper to geocode address
export const geocodeAddress = async (address: string) => {
  try {
    const response = await mapsClient.geocode({
      params: {
        address,
        key: config.googleMaps.apiKey,
      },
    });

    const result = response.data.results[0];

    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

export default mapsClient;
