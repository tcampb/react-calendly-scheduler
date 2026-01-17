import { Phone, MapPin, Video } from "lucide-react";
import type { LocationConfiguration } from "react-calendly-components";

const VideoConferenceIcon = ({ className }: { className?: string }) => (
  <Video className={className} style={{ color: '#0069ff' }} />
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <Phone className={className} style={{ color: '#0069ff' }} />
);

const PhysicalLocationIcon = ({ className }: { className?: string }) => (
  <MapPin className={className} style={{ color: '#d946ef' }} />
);

const AskInviteeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#0069ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3" fill="#0069ff" stroke="none"/>
    <text x="12" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" stroke="none">?</text>
  </svg>
);

const CustomLocationIcon = ({ className }: { className?: string }) => (
  <MapPin className={className} style={{ color: '#6b7280' }} />
);

export function getLocationIcon(location: LocationConfiguration, className: string = "h-4 w-4") {
  switch (location.kind) {
    case "google_conference":
    case "microsoft_teams_conference":
    case "zoom_conference":
    case "webex_conference":
    case "gotomeeting_conference":
      return <VideoConferenceIcon className={className} />;
    case "inbound_call":
    case "outbound_call":
      return <PhoneIcon className={className} />;
    case "physical":
      return <PhysicalLocationIcon className={className} />;
    case "ask_invitee":
      return <AskInviteeIcon className={className} />;
    case "custom":
    default:
      return <CustomLocationIcon className={className} />;
  }
}
