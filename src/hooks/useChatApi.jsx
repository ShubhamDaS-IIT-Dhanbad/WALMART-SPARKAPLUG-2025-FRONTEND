import { useState } from "react";
import axios from "axios";

const server = "https://walmart-sparkaplug-2025-backend-1.onrender.com/productqa";

const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async ({query,product_id}) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(product_id,query)
      const response = await axios.post(server, {
        product_id,
        query,
      });
      console.log(response)
      return response.data;
    } catch (err) {
      let customError = err.message;

      if (customError.includes("Network Error")) {
        customError =
          "CORS error or network issue. Please contact the server team to allow your endpoint.";
      }

      setError(customError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};

export default useChatApi;
