import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ac28-124-29-214-61.ngrok-free.app/api/v1/", // Your base URL
  timeout: 10000, // Example timeout (in milliseconds)
  headers: {
    "Content-Type": "application/json",
    // You can add common headers here if needed
  },
});

export default axiosInstance;
