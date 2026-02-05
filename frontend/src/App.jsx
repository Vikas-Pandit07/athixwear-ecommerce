import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../src/assets/css/globals.css";
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 650);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {routeLoading && (
        <div className="app-loader" aria-live="polite" aria-busy="true">
          <div className="loader-ring">
            <img src={logoSrc} alt="AthixWear" />
          </div>
        </div>
      )}
      <AppRoutes />
    </>
  );
}

export default App;
