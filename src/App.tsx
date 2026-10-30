import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}
