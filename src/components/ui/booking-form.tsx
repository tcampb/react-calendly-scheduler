import { useState, useRef, useEffect } from "react";
import { CalendarDays, Clock, Users, CheckCircle } from "lucide-react";
import {
  useScheduleEvent,
  type CustomQuestion,
  type EventType,
  type LocationConfiguration,
} from "react-calendly-components";
import { CalendlyErrorDisplay } from "@/components/ui/calendly-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  TextQuestion,
  PhoneQuestion,
  SingleSelectQuestion,
  MultiSelectQuestion,
} from "@/components/ui/questions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getLocationIcon } from "@/components/ui/location-icons";

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

interface BookingFormProps {
  eventType: EventType;
  selectedTime: { start_time: string };
  onBack: () => void;
  timezone: string;
  submitButtonText?: string;
}

function BookingForm({
  eventType,
  selectedTime,
  onBack,
  timezone,
  submitButtonText = "Schedule Event",
}: BookingFormProps) {
  const { schedule, error, loading, scheduledEvent } = useScheduleEvent();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const errorRef = useRef<HTMLDivElement>(null);

  // Scroll to error when API error occurs
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const locations = eventType.locations || [];
  const hasMultipleLocations = locations.length > 1;
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [inviteePhoneNumber, setInviteePhoneNumber] = useState("");
  const [inviteeLocation, setInviteeLocation] = useState("");

  const selectedLocation = locations.length > 0 ? locations[selectedLocationIndex] : undefined;
  const requiresPhoneNumber = selectedLocation?.kind === "outbound_call";
  const requiresInviteeLocation = selectedLocation?.kind === "ask_invitee";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validate required custom questions
    const errors: string[] = [];
    eventType.custom_questions.forEach((question, index) => {
      if (!question.enabled) return;

      const questionKey = `question_${index}`;
      const value = formData[questionKey];
      const otherValue = formData[`${questionKey}_other`];

      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      // Check if required field is empty
      if (question.required && isEmpty) {
        errors.push(question.name);
        return;
      }

      // Check if "other" is selected but no value provided
      if (question.include_other) {
        const hasOtherSelected =
          value === "other" || (Array.isArray(value) && value.includes("other"));

        if (hasOtherSelected && (!otherValue || otherValue.trim() === "")) {
          errors.push(`${question.name} - Please specify your "Other" response`);
        }
      }
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }

    const questions_and_answers = Object.entries(formData)
      .filter(([key]) => !key.endsWith("_other"))
      .map(([key, value]) => {
        const index = parseInt(key.split("_")[1]);
        const question = eventType.custom_questions[index];
        const otherValue = formData[`${key}_other`] || "";

        let answer: string;
        if (Array.isArray(value)) {
          // For multi_select: replace "other" with the actual otherValue
          const processedValues = value.map((v: string) =>
            v === "other" ? otherValue : v
          );
          answer = processedValues.join(", ");
        } else if (value === "other") {
          // For single_select: use otherValue instead of "other"
          answer = otherValue;
        } else {
          answer = String(value);
        }

        return {
          question: question.name,
          answer,
          position: question.position,
        };
      });

    // Build location object with invitee-provided data if applicable
    let locationPayload: LocationConfiguration | undefined;
    if (selectedLocation) {
      locationPayload = { ...selectedLocation };
      if (selectedLocation.kind === "outbound_call" && inviteePhoneNumber) {
        locationPayload.location = inviteePhoneNumber;
      }
      if (selectedLocation.kind === "ask_invitee" && inviteeLocation) {
        locationPayload.location = inviteeLocation;
      }
    }

    await schedule({
      start_time: selectedTime.start_time,
      questions_and_answers,
      invitee: {
        name,
        email,
        timezone,
      },
      event_guests: guests
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g.length > 0),
      ...(locationPayload && { location: locationPayload }),
    });
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderQuestion = (question: CustomQuestion, index: number) => {
    const questionKey = `question_${index}`;
    const value = formData[questionKey] || "";
    const otherValue = formData[`${questionKey}_other`] || "";

    switch (question.type) {
      case "text":
      case "string":
        return (
          <TextQuestion
            key={index}
            question={question}
            questionKey={questionKey}
            value={value}
            onChange={handleInputChange}
          />
        );
      case "phone_number":
        return (
          <PhoneQuestion
            key={index}
            question={question}
            questionKey={questionKey}
            value={value}
            onChange={handleInputChange}
          />
        );
      case "single_select":
        return (
          <SingleSelectQuestion
            key={index}
            question={question}
            questionKey={questionKey}
            value={value}
            onChange={handleInputChange}
            otherValue={otherValue}
            onOtherChange={handleInputChange}
          />
        );
      case "multi_select":
        return (
          <MultiSelectQuestion
            key={index}
            question={question}
            questionKey={questionKey}
            value={value}
            onChange={handleInputChange}
            otherValue={otherValue}
            onOtherChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  const selectedDate = new Date(selectedTime.start_time);
  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = selectedDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const customQuestions = eventType.custom_questions.sort(
    (a, b) => a.position - b.position,
  );

  if (scheduledEvent) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">You are scheduled</CardTitle>
          <p className="text-muted-foreground mt-2">
            A calendar invitation has been sent to your email address.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <h3 className="font-semibold">{eventType.name}</h3>
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formattedTime}</span>
            </div>
            {locations.length > 0 && selectedLocation && (
              <div className="flex items-center gap-3 text-sm">
                {getLocationIcon(selectedLocation, "h-4 w-4 flex-shrink-0")}
                <span>
                  {selectedLocation.kind === "outbound_call" && inviteePhoneNumber
                    ? `Phone call: ${inviteePhoneNumber}`
                    : selectedLocation.kind === "ask_invitee" && inviteeLocation
                      ? inviteeLocation
                      : getLocationDisplayName(selectedLocation)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 border-t bg-muted/30 px-6 py-4">
          <div className="flex w-full gap-3">
            <Button asChild variant="outline" className="flex-1">
              <a
                href={scheduledEvent.rescheduling_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Reschedule
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a
                href={scheduledEvent.cancellation_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancel
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Enter Details</CardTitle>
        <div className="mt-4 flex flex-col gap-2 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium">{formattedTime}</span>
          </div>
          {locations.length === 1 && (
            <div className="flex items-center gap-3 text-sm">
              {getLocationIcon(locations[0], "h-4 w-4 flex-shrink-0")}
              <span className="font-medium">
                {getLocationDisplayName(locations[0])}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div ref={errorRef}>
            {error && <CalendlyErrorDisplay error={error} />}
            {validationErrors.length > 0 && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm font-medium text-destructive mb-2">
                  Please fill in the following required fields:
                </p>
                <ul className="list-disc list-inside text-sm text-destructive">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1.5"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location Selection Section */}
          {hasMultipleLocations && (
            <>
              <div className="border-t" />
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Location
                </h3>
                <RadioGroup
                  value={String(selectedLocationIndex)}
                  onValueChange={(value) =>
                    setSelectedLocationIndex(Number(value))
                  }
                >
                  {locations.map((location, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={String(index)}
                        id={`location-${index}`}
                      />
                      <Label
                        htmlFor={`location-${index}`}
                        className="flex items-center gap-2 font-normal cursor-pointer"
                      >
                        {getLocationIcon(location, "h-4 w-4 flex-shrink-0")}
                        {getLocationDisplayName(location)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {/* Invitee-provided location input */}
          {requiresPhoneNumber && (
            <>
              {!hasMultipleLocations && <div className="border-t" />}
              <div className="space-y-4">
                {!hasMultipleLocations && (
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Location
                  </h3>
                )}
                <div>
                  <Label htmlFor="invitee-phone">Phone Number *</Label>
                  <PhoneInput
                    id="invitee-phone"
                    value={inviteePhoneNumber}
                    onChange={(value) => setInviteePhoneNumber(value || "")}
                    placeholder="Enter your phone number"
                    className="mt-1.5"
                    defaultCountry="US"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll call you at this number for the meeting.
                  </p>
                </div>
              </div>
            </>
          )}

          {requiresInviteeLocation && (
            <>
              {!hasMultipleLocations && <div className="border-t" />}
              <div className="space-y-4">
                {!hasMultipleLocations && (
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Location
                  </h3>
                )}
                <div>
                  <Label htmlFor="invitee-location">Your Location *</Label>
                  <Input
                    id="invitee-location"
                    value={inviteeLocation}
                    onChange={(e) => setInviteeLocation(e.target.value)}
                    placeholder="Enter your preferred meeting location"
                    className="mt-1.5"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Please provide your preferred location for this meeting.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Custom Questions Section */}
          {customQuestions.length > 0 && (
            <>
              <div className="border-t" />
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Additional Information
                </h3>
                <div className="space-y-5">
                  {customQuestions.map((question, index) =>
                    renderQuestion(question, index),
                  )}
                </div>
              </div>
            </>
          )}

          {/* Additional Guests Section */}
          <div className="border-t" />
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Guests
            </h3>
            <div>
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Additional Guests
              </Label>
              <Input
                id="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="guest1@email.com, guest2@email.com"
                className="mt-1.5"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-5 flex flex-col-reverse sm:flex-row gap-3 border-t bg-muted/30 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="w-full sm:flex-1" disabled={loading}>
            {loading ? "Scheduling..." : submitButtonText || "Schedule Event"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export { BookingForm };
