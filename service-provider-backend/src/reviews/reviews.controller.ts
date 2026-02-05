import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma-generated/enums';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // USER → create review after COMPLETED booking
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.USER])
  create(@Body() dto: CreateReviewDto, @Req() req) {
    return this.reviewsService.create(dto, req.user.id);
  }

  // PUBLIC → get all reviews for a provider service
  // REMOVED @UseGuards to make this endpoint public
  @Get('service/:id')
  getReviews(@Param('id') providerServiceId: string) {
    return this.reviewsService.getByProviderService(providerServiceId);
  }
}
