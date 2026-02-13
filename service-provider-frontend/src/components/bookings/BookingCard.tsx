import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingStatusBadge } from './BookingStatusBadge';
import { Booking } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function BookingCard({ booking, onCancel, showActions = true }: BookingCardProps) {
  const canCancel = booking.status === 'PENDING' || booking.status === 'ACCEPTED';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {booking.providerService.serviceTemplate.title}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Provider: {booking.providerService.provider.user.name}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{booking.timeSlot}</span>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold text-lg">
              {formatCurrency(booking.providerService.price)}
            </p>
          </div>
        </div>

        {showActions && canCancel && onCancel && (
          <div className="mt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="w-full"
            >
              Cancel Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}