import React from "react";
import Router from "./frameworkUI/routesHandling/Router";
import WaveAnimation from "./interface/components/waveAnimation/WaveAnimation";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./useCases/context/AuthContext";

const App = () => {
  return (
    <div>
      <div className="main-container">
      <WaveAnimation />
        <div className="content">
          <BrowserRouter>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default App;
