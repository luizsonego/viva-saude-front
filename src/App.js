import "./tailwind.css";
import queryClient from "./clientProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import MainRouter from "./routes";
import { useLocation, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  return (
    <QueryClientProvider client={queryClient}>
      <MainRouter />
      {/* {background && <Route path="contact/:name" children={<Home />} />} */}
    </QueryClientProvider>
  );
}

export default App;
