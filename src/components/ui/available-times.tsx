import { type Availability } from "react-calendly-components";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function AvailableTimes({
  availability,
  loading,
  onTimeSelect,
}: {
  availability: Availability | null;
  loading: boolean;
  onTimeSelect: (spot: any) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-80">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  const spots = availability?.spots?.filter((spot) => spot.status === "available") || [];

  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <CalendarX className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          No times available
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Select another date
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 min-h-80 max-h-96 overflow-y-auto pr-1">
      {spots.map((spot) => (
        <Button
          key={spot.start_time}
          variant="outline"
          className="w-full h-12 font-semibold text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          onClick={() => onTimeSelect(spot)}
        >
          {new Date(spot.start_time).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </Button>
      ))}
    </div>
  );
}

export { AvailableTimes };
