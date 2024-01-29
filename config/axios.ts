import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const REQUEST_TIMEOUT = 30000;

// generate with ngrok
const baseUrl = "https://api.clinus.live/api/";
export const axiosClient = axios.create({
  baseURL: baseUrl, // Set the base URL for all requests
  timeout: 30000, // Set the default timeout for requests

  // Set default headers if needed
  headers: {
    common: {
      "Content-Type": "application/json",
      "X-Mobile": true,
    },
  },
});

const InterceptorsRequest = async (config: AxiosRequestConfig) => {
  // lấy token từ store và gắn vào header trước khi gửi request
  let token = await AsyncStorage.getItem("token");
  if (token) {
    // token = JSON.parse(token);
  }
  if (token === undefined) {
    return config;
  }

  const interceptorHeaders = {
    token: `Bearer ${token}`,
    authorization: `Bearer ${token}`,
    "X-Mobile": true,
  };

  const headers = {
    ...config.headers,
    ...interceptorHeaders,
  };

  config.headers = headers;
  return config;
};

const InterceptorsError = (error: AxiosError) => {
  if (error.config) {
    // console.log("Request:", error.config);
  }
  if (error.response) {
    // console.log("Response:", error.response);
  }
  return Promise.reject(error);
};

const InterceptorResponse = (response: AxiosResponse) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
};

axiosClient.interceptors.request.use(
  InterceptorsRequest as any,
  InterceptorsError
);
axiosClient.interceptors.response.use(InterceptorResponse, InterceptorsError);
