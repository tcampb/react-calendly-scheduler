import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CalendlyScheduler from "./CalendlyScheduler.tsx";

const CLIENT_ID = ""
const EVENT_TYPE_UUID = ""

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalendlyScheduler
      clientId={CLIENT_ID}
      eventTypeUuid={EVENT_TYPE_UUID}
    />
  </StrictMode>,
);
