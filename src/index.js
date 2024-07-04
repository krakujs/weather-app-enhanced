import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TemperatureProvider } from './TemperatureContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TemperatureProvider>
      <App />
    </TemperatureProvider>
  </React.StrictMode>
);