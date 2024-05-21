import { BrowserRouter } from "react-router-dom";
import Router from "./framework/router/Router";
import { AuthProvider } from "./utilities/authContext/AuthProvider";
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
