import { MapPin } from "lucide-react";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface LocationOption {
  name: string;
  eventTypeUuid: string;
}

function LocationSelect({
  locations,
  selectedLocation,
  onLocationChange,
}: {
  locations: LocationOption[];
  selectedLocation: LocationOption;
  onLocationChange: (location: LocationOption) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-sm font-semibold">
        Location
      </Label>
      <Select
        value={selectedLocation.eventTypeUuid}
        onValueChange={(uuid) => {
          const location = locations.find((l) => l.eventTypeUuid === uuid);
          if (location) {
            onLocationChange(location);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup id="location">
            {locations.map(({ name, eventTypeUuid }) => (
              <SelectItem key={eventTypeUuid} value={eventTypeUuid}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { LocationSelect };
export type { LocationOption };
