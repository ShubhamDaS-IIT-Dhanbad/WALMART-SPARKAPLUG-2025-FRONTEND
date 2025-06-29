import { useState } from "react";
import axios from "axios";
import conf from '../config/conf.js'

const server = conf.serverUrl;
const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendMessage = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${server}/chat`, { question: query });
      return response.data; // ✅ stringify here
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
