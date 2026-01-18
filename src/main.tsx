import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CalendlyScheduler from "./CalendlyScheduler.tsx";

// ecf8d175-5241-4d4e-81f5-5c23d15038b0&event_type_uuid=5accc827-edc9-45b9-9cf1-a6ed4f2c03f2
const CLIENT_ID = "ecf8d175-5241-4d4e-81f5-5c23d15038b0"
const EVENT_TYPE_UUID = "5accc827-edc9-45b9-9cf1-a6ed4f2c03f2"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CalendlyScheduler
      clientId={CLIENT_ID}
      eventTypeUuid={EVENT_TYPE_UUID}
      availabilityOnly={true}
    />
  </StrictMode>,
);
