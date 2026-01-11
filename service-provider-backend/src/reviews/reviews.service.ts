import {
  Injectable,
  ForbiddenException,
  NotFoundException,
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

    const existingReview = await this.db.review.findFirst({
      where: {
        userId,
        providerServiceId: booking.providerServiceId,
      },
    });

    if (existingReview)
      throw new ForbiddenException('You already reviewed this service');

    return this.db.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId,
        providerServiceId: booking.providerServiceId,
      },
    });
  }

  // Get all reviews for a provider service
  getByProviderService(providerServiceId: string) {
    return this.db.review.findMany({
      where: { providerServiceId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
