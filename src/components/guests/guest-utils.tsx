"use client";

import { Badge } from "@/components/ui/badge";

export function getRSVPStatusBadge(status: string) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'declined':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  return (
    <Badge 
      variant="secondary" 
      className={`text-xs ${getStatusColor(status)}`}
    >
      {getStatusText(status)}
    </Badge>
  );
}
