# react-calendly-scheduler

<img width="821" height="561" alt="image" src="https://github.com/user-attachments/assets/25046af8-2295-449c-a14e-d16c4d03e56b" />


## 📅 Overview

This package provides a prebuilt React component that replicates Calendly’s scheduling page experience without relying on an iframe.

Instead of embedding Calendly’s hosted UI, the component renders a native React scheduling interface and communicates with Calendly’s API via https://components.calforce.pro. This gives you full control over styling, layout, and behavior while preserving Calendly’s scheduling functionality.

## Installation

```bash
npm install react-calendly-scheduler
```

## Usage

```tsx
import CalendlyScheduler from "react-calendly-scheduler";
import "react-calendly-scheduler/styles.css";

function App() {
  return (
    <CalendlyScheduler
      clientId="your-calendly-components-client-id"
      eventTypeUuid="your-event-type-uuid"
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `clientId` | `string` | Yes | Your Calendly Components API client ID |
| `eventTypeUuid` | `string` | Yes | The UUID of the Calendly event type to display |
| `availabilityOnly` | `boolean` | No | When `true`, disables time slot selection and hides the booking form. Useful for displaying availability without allowing bookings. |
| `submitButtonText` | `string` | No | Custom text for the booking form submit button. Defaults to `"Schedule Event"`. |
| `locationAvailability` | `LocationOption[]` | No | Array of location options that allow users to switch between different event types. Each option has `name` and `eventTypeUuid`. |

### Location Availability

The `locationAvailability` prop enables a unified calendar view where users can select between different locations (each backed by a separate Calendly event type). This is useful when you offer the same service in different formats (e.g., in-person vs virtual).

```tsx
import { CalendlyScheduler, LocationOption } from "react-calendly-scheduler";
import "react-calendly-scheduler/styles.css";

const locations: LocationOption[] = [
  { name: "Video Conference", eventTypeUuid: "abc-123" },
  { name: "In Person", eventTypeUuid: "def-456" },
];

function App() {
  return (
    <CalendlyScheduler
      clientId="your-client-id"
      eventTypeUuid="abc-123"
      locationAvailability={locations}
    />
  );
}
```

## Styling

The component comes with pre-compiled CSS. No Tailwind CSS installation is required in your project.

Import the stylesheet in your application:

```tsx
import "react-calendly-scheduler/styles.css";
```

The component uses CSS custom properties for theming. You can override these variables to customize the appearance:

```css
:root {
  --background: oklch(100% 0 0);
  --foreground: oklch(14.5% 0 0);
  --primary: oklch(20.5% 0 0);
  --primary-foreground: oklch(98.5% 0 0);
  --muted: oklch(97% 0 0);
  --muted-foreground: oklch(55.6% 0 0);
  --border: oklch(92.2% 0 0);
  --ring: oklch(70.8% 0 0);
  --radius: 0.625rem;
  /* ... additional variables available */
}
```

Dark mode is supported via the `.dark` class on a parent element.

## License

MIT
