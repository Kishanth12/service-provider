import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingStatus } from '@prisma-generated/enums';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  // Create review after COMPLETED booking
  async create(dto: CreateReviewDto, userId: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: dto.bookingId },
      include: { providerService: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.userId !== userId)
      throw new ForbiddenException('Not your booking');

    if (booking.status !== BookingStatus.COMPLETED)
      throw new ForbiddenException('Booking not completed yet');

    // FIXED: Check by bookingId instead of providerServiceId
    // This allows multiple reviews for same service if user books multiple times
    const existingReview = await this.db.review.findFirst({
      where: {
        bookingId: dto.bookingId, // Changed from userId + providerServiceId
      },
    });

    if (existingReview)
      throw new ForbiddenException('You already reviewed this booking');

    return this.db.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId,
        bookingId: dto.bookingId, // Added bookingId
        providerServiceId: booking.providerServiceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            date: true,
          },
        },
      },
    });
  }

  // Get all reviews for a provider service
  async getByProviderService(providerServiceId: string) {
    return this.db.review.findMany({
      where: { providerServiceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
