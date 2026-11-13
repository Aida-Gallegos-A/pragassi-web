import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Solicitud } from "./solicitud";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Solicitud />
  </StrictMode>,
);
