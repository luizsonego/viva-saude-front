import { QueryClient } from "@tanstack/react-query";
import api from "../services/api";

const queryClient = new QueryClient({
  defaultOptions: {
    retry: 2,
    staleTime: 1000 * 30, // 30seconds
    cacheTime: 1000 * 30, //30 seconds
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
    refetchInterval: 1000 * 30, //30 seconds
    refetchIntervalInBackground: false,
    suspense: false,
  },
});

api.get("/");

export default queryClient;
