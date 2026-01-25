"use client";

import { useState, useOptimistic, startTransition } from "react";
import { deleteGuest, updateGuest } from "@/actions/guests";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronDown,
  ChevronUp,
  Mail01Icon,
  PhoneCall,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { GuestEditDialog } from "./guest-edit-dialog";
import { GuestDeleteDialog } from "./guest-delete-dialog";
import { GuestExpandedSection } from "./guest-expanded-section";
import { getRSVPStatusBadge } from "./guest-utils";

interface Guest {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  plusOnes: number;
}

interface GuestEvent {
  id: string;
  name: string;
  rsvpStatus: 'pending' | 'accepted' | 'declined';
}

interface GuestItemProps {
  guest: Guest;
  weddingId: string;
  additionalEvents?: GuestEvent[];
}

export function GuestItem({ 
  guest, 
  weddingId, 
  additionalEvents = [] 
}: GuestItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 transition-all duration-200 ${
        isDeleting ? "opacity-50" : ""
      } ${isExpanded ? "shadow-md" : "hover:shadow"}`}
    >
      <div className="px-4 py-3">
        {/* Mobile Layout */}
        <div className="flex flex-col sm:hidden space-y-2">
          {/* Guest Name and Plus Ones */}
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate flex-1">{guest.name}</p>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={UserMultiple02Icon} strokeWidth={2} className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs">{guest.plusOnes}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="h-3 w-3" />
                <p>{guest.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <HugeiconsIcon icon={PhoneCall} strokeWidth={2} className="h-3 w-3" />
                <p>{guest.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <GuestEditDialog guest={guest} weddingId={weddingId} />
              <GuestDeleteDialog guest={guest} weddingId={weddingId} />
              
              {/* Expand/Collapse Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpand}
                className="h-7 w-7 p-0"
              >
                <HugeiconsIcon 
                  icon={isExpanded ? ChevronUp : ChevronDown} 
                  strokeWidth={2} 
                  className="h-3.5 w-3.5" 
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center">
          {/* Guest Info Columns */}
          <div className="flex items-center flex-1 min-w-0 text-sm">
            {/* Name Column */}
            <div className="flex-1 min-w-[120px] max-w-[180px]">
              <p className="font-medium truncate">{guest.name}</p>
            </div>
            
            {/* Email Column */}
            <div className="flex-1 min-w-[140px] max-w-[200px] px-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-muted-foreground truncate">{guest.email}</p>
              </div>
            </div>
            
            {/* Contact Number Column */}
            <div className="flex-1 min-w-[100px] max-w-[130px] px-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={PhoneCall} strokeWidth={2} className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-muted-foreground truncate">{guest.phoneNumber}</p>
              </div>
            </div>
            
            {/* Plus One Column */}
            <div className="w-20 px-3">
              <div className="flex items-center justify-center gap-1">
                <HugeiconsIcon icon={UserMultiple02Icon} strokeWidth={2} className="h-3.5 w-3.5 text-muted-foreground" />
                <p>{guest.plusOnes}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-4">
            <GuestEditDialog guest={guest} weddingId={weddingId} />
            <GuestDeleteDialog guest={guest} weddingId={weddingId} />
            
            {/* Expand/Collapse Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpand}
              className="h-7 w-7 p-0 ml-1"
            >
              <HugeiconsIcon 
                icon={isExpanded ? ChevronUp : ChevronDown} 
                strokeWidth={2} 
                className="h-3.5 w-3.5" 
              />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Expanded Section */}
      {isExpanded && (
        <GuestExpandedSection
          weddingId={weddingId}
          guestId={guest.id}
          additionalEvents={additionalEvents}
          getRSVPStatusBadge={getRSVPStatusBadge}
        />
      )}
    </div>
  );
}
