import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookingDto } from './dto/create-booking-dto';
import { BookingStatus } from '@prisma-generated/enums';

@Injectable()
export class BookingsService {
  constructor(private readonly db: DatabaseService) {}

  // USER → create booking
  async create(dto: CreateBookingDto, userId: string) {
    const exists = await this.db.booking.findFirst({
      where: {
        providerServiceId: dto.providerServiceId,
        date: new Date(dto.date),
        timeSlot: dto.timeSlot,
        status: { not: BookingStatus.CANCELLED },
      },
    });

    if (exists) {
      throw new ForbiddenException('Time slot already booked');
    }

    return this.db.booking.create({
      data: {
        userId,
        providerServiceId: dto.providerServiceId,
        date: new Date(dto.date),
        timeSlot: dto.timeSlot,
        status: BookingStatus.PENDING,
      },
    });
  }

  // USER → my bookings
  findByUser(userId: string) {
    return this.db.booking.findMany({
      where: { userId },
      include: {
        providerService: {
          include: {
            serviceTemplate: true,
            provider: { include: { user: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  // USER → cancel booking
  async cancel(bookingId: string, userId: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new ForbiddenException('Cannot cancel completed booking');
    }

    return this.db.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  // PROVIDER/ADMIN → dashboard
  findByProvider(providerId?: string) {
    return this.db.booking.findMany({
      where: providerId
        ? {
            providerService: { providerId },
          }
        : undefined,
      include: {
        user: true,
        providerService: {
          include: {
            serviceTemplate: true,
            provider: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  // PROVIDER → update status
  async updateStatus(bookingId: string, status: BookingStatus, userId: string) {
    const provider = await this.db.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new ForbiddenException('Provider profile not found');
    }

    const booking = await this.db.booking.findUnique({
      where: { id: bookingId },
      include: { providerService: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.providerService.providerId !== provider.id) {
      throw new ForbiddenException('Access denied');
    }

    return this.db.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
}
