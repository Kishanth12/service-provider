import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/types';
import { cn } from '@/lib/utils/cn';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig = {
  [BookingStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  [BookingStatus.ACCEPTED]: {
    label: 'Accepted',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  [BookingStatus.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  [BookingStatus.COMPLETED]: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  [BookingStatus.CANCELLED]: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {config.label}
    </Badge>
  );
}