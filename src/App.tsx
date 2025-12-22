
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import ClickSpark from "./components/common/ClickSpark";

export default function App() {
  return (
    <BrowserRouter>
      <ClickSpark sparkColor="#1E6BFF" sparkSize={8} sparkRadius={28} sparkCount={10} duration={520} maxSparks={400}>
        <div className="min-h-screen">
          <AppRouter />
        </div>
      </ClickSpark>
    </BrowserRouter>
  );
}
