import { Globe } from "lucide-react";
import { useTimezones } from "react-calendly-components";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function TimezoneSelect({
  selectedTimezone,
  setSelectedTimezone,
}: {
  selectedTimezone: string;
  setSelectedTimezone: (value: string) => void;
}) {
  const { timezones } = useTimezones();

  return (
    <div className="space-y-2">
      <Label htmlFor="timezone" className="text-sm font-semibold">
        Time zone
      </Label>
      <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup id="timezone">
            {timezones.map(({ name, id }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { TimezoneSelect };
