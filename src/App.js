import "./tailwind.css";
import queryClient from "./clientProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import MainRouter from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainRouter />
    </QueryClientProvider>
  );
}

export default App;
