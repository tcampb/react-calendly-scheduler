import { useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { AppProvider as CalendlyAppProvider } from "react-calendly-components";
import "./index.css";
import {
  type Availability,
  type LocationConfiguration,
  useAvailableTimes,
  useEventType,
} from "react-calendly-components";
import { Calendar } from "@/components/ui/calendar";
import { TimezoneSelect } from "@/components/ui/timezone-select";
import { Spinner } from "@/components/ui/spinner";
import { AvailableTimes } from "@/components/ui/available-times";
import { BookingForm } from "./components/ui/booking-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getLocationDisplayName = (location: LocationConfiguration): string => {
  const kindLabels: Record<string, string> = {
    ask_invitee: "I will provide my location",
    custom: location.location || "Custom Location",
    google_conference: "Google Meet",
    gotomeeting_conference: "GoToMeeting",
    inbound_call: "Phone call (I will call you)",
    microsoft_teams_conference: "Microsoft Teams",
    outbound_call: "Phone call",
    physical: location.location || "In-person meeting",
    webex_conference: "Webex",
    zoom_conference: "Zoom",
  };
  return kindLabels[location.kind] || location.kind;
};

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date>(new Date());
  const [showMobileTimesView, setShowMobileTimesView] = useState(false);
  const { eventType, loading: eventTypeLoading } = useEventType();

  const {
    availableTimes,
    loading: availableTimesLoading,
    error: availableTimesError,
  } = useAvailableTimes({
    rangeEnd: formatDate(
      new Date(month.getFullYear(), month.getMonth() + 1, 1),
    ),
    rangeStart: formatDate(new Date(month.getFullYear(), month.getMonth(), 1)),
    timezone: selectedTimezone,
  });

  const [availability, setAvailability] = useState<Availability | null>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);

  useEffect(() => {
    if (date) {
      const dateStr = formatDate(date);
      const foundAvailability = availableTimes.find(
        ({ date: d }) => d === dateStr,
      );
      setAvailability(foundAvailability || null);
    } else {
      setAvailability(null);
    }
  }, [date, availableTimes]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setShowMobileTimesView(true);
    }
  };

  const handleMobileBack = () => {
    setShowMobileTimesView(false);
  };

  const selectedDayOfWeek = date
    ? date.toLocaleDateString(undefined, { weekday: "long" })
    : null;

  const selectedDateFormatted = date
    ? date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const selectedDateShort = date
    ? date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  // Event Info Component - Desktop sidebar version
  const EventInfoSidebar = () => (
    <div className="p-6 lg:border-r min-h-40 hidden lg:block">
      {eventTypeLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold mt-1">{eventType?.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{eventType?.duration} min</span>
          </div>

          {eventType?.locations?.length === 1 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{getLocationDisplayName(eventType.locations[0])}</span>
            </div>
          )}

          {eventType?.description_plain && (
            <p className="text-sm pt-2 border-t">
              {eventType.description_plain}
            </p>
          )}
        </div>
      )}
    </div>
  );

  // Event Info Component - Mobile header version
  const MobileEventHeader = () => (
    <div className="p-4 border-b lg:hidden">
      {eventTypeLoading ? (
        <div className="flex items-center justify-center py-2">
          <Spinner className="h-5 w-5" />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-lg font-bold">{eventType?.name}</h1>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>{eventType?.duration} min</span>
          </div>
          {eventType?.locations?.length === 1 && (
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span>{getLocationDisplayName(eventType.locations[0])}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Mobile Times View
  const MobileTimesView = () => (
    <Card className="shadow-lg w-full overflow-hidden rounded-none">
      {/* Header with back button */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMobileBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center pr-10">
            <h2 className="font-semibold text-lg">{selectedDayOfWeek}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedDateFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* Timezone */}
      <div className="p-4 border-b">
        <TimezoneSelect
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
        />
      </div>

      {/* Times */}
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg">Select a Time</h3>
          <p className="text-sm text-muted-foreground">
            Duration: {eventType?.duration} min
          </p>
        </div>
        <AvailableTimes
          availability={availability}
          loading={availableTimesLoading}
          onTimeSelect={setSelectedTime}
        />
      </div>
    </Card>
  );

  const Content = () => {
    if (selectedTime) {
      return (
        <div className="w-full max-w-xl mx-auto">
          <BookingForm
            eventType={eventType!}
            selectedTime={selectedTime}
            onBack={() => setSelectedTime(null)}
            timezone={selectedTimezone}
          />
        </div>
      );
    }

    return (
      <>
        {/* Mobile Times View - only visible on mobile when date selected */}
        {showMobileTimesView && date && (
          <div className="lg:hidden w-full">
            <MobileTimesView />
          </div>
        )}

        {/* Main Card - Hidden on mobile when times view is shown */}
        <Card
          className={`shadow-lg w-full lg:w-fit lg:mx-auto max-w-full overflow-hidden rounded-none lg:rounded-xl ${showMobileTimesView && date ? "hidden lg:block" : ""}`}
        >
          {/* Mobile Event Header */}
          <MobileEventHeader />

          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar - Event Info (desktop only) */}
            <div className="lg:w-64 lg:border-b-0">
              <EventInfoSidebar />
            </div>

            {/* Middle - Calendar */}
            <div className="p-6 lg:border-r">
              <div className="mb-6 pb-4 border-b">
                <TimezoneSelect
                  selectedTimezone={selectedTimezone}
                  setSelectedTimezone={setSelectedTimezone}
                />
              </div>
              <h2 className="font-semibold text-lg mb-6">
                Select a Date & Time
              </h2>
              <div className="relative">
                {availableTimesLoading && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                    <Spinner className="h-8 w-8" />
                  </div>
                )}
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  month={month}
                  onMonthChange={setMonth}
                  className="rounded-lg border-0 w-full"
                  captionLayout="dropdown"
                  error={availableTimesError}
                  disabled={(date) => {
                    if (availableTimesError) {
                      return true;
                    }
                    const dateStr = formatDate(date);
                    const availability = availableTimes.find(
                      ({ date: d }) => d === dateStr,
                    );

                    if (!availability) {
                      return true;
                    }

                    return availability.status === "unavailable";
                  }}
                />
              </div>
            </div>

            {/* Right - Available Times (desktop only) */}
            {date && (
              <div className="hidden lg:block p-6 w-60">
                <div className="mb-4">
                  <h3 className="font-semibold">{selectedDateShort}</h3>
                </div>
                <AvailableTimes
                  availability={availability}
                  loading={availableTimesLoading}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            )}
          </div>
        </Card>
      </>
    );
  };

  return <Content />;
}

export interface CalendlySchedulerProps {
  clientId: string;
  eventTypeUuid: string;
}

export default function CalendlyScheduler({
  clientId,
  eventTypeUuid,
}: CalendlySchedulerProps) {
  return (
    <CalendlyAppProvider clientId={clientId} eventTypeUuid={eventTypeUuid}>
      <App />
    </CalendlyAppProvider>
  );
}
