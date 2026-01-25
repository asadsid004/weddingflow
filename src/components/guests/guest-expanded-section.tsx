"use client";

interface GuestEvent {
  id: string;
  name: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
}

interface GuestExpandedSectionProps {
  additionalEvents: GuestEvent[];
  getRSVPStatusBadge: (status: string) => React.ReactNode;
}

export function GuestExpandedSection({
  additionalEvents,
  getRSVPStatusBadge,
}: GuestExpandedSectionProps) {
  if (additionalEvents.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 bg-muted/30">
      <div className="px-4 py-3">
        <div className="pl-4 sm:pl-8 space-y-1">
          {additionalEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-1 px-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-sm">{event.name}</span>
              </div>
              {getRSVPStatusBadge(event.rsvpStatus)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
