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

  async create(dto: CreateReviewDto, userId: string) {
    const booking = await this.db.booking.findUnique({
      where: { id: dto.bookingId },
      include: { providerService: true },
    });

    if (!booking) throw new NotFoundException({message:'Booking not found'});

    if (booking.userId !== userId)
      throw new ForbiddenException({message:'Not your booking'});

    if (booking.status !== BookingStatus.COMPLETED)
      throw new ForbiddenException({message:'Booking not completed yet'});

    const existingReview = await this.db.review.findFirst({
      where: {
        userId,
        providerServiceId: booking.providerServiceId,
      },
    });

    if (existingReview)
      throw new ForbiddenException({message:'You have already reviewed this service. Thank you for your feedback!'});

    return this.db.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId,
        bookingId: dto.bookingId,
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
