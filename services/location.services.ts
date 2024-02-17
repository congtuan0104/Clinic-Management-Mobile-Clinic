import { IApiResponse } from "../types";
import { IMapBoxLocation } from "../types/location.types";
import axios from "axios";

export const locationApi = {
  getSuggestLocations: (
    address: string
  ): Promise<IApiResponse<IMapBoxLocation>> => {
    return axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?country=vn&proximity=ip&access_token=pk.eyJ1IjoiY29uZ3R1YW4wMTA0IiwiYSI6ImNsczF2eXRxYTBmbmcya2xka3B6cGZrMnQifQ.AHAzE7JIHyehx-m1YJbzFg`
    );
  },
};
