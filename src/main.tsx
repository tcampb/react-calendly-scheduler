import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CalendlyScheduler from "./CalendlyScheduler.tsx";

const params = new URLSearchParams(window.location.search);
const clientId = params.get("client_id");
const eventTypeUuid = params.get("event_type_uuid");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalendlyScheduler
      clientId={clientId!}
      eventTypeUuid={eventTypeUuid!}
      availabilityOnly={false}
    />
  </StrictMode>,
);
