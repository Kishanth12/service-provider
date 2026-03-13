import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateBookingDto } from './dto/create-booking-dto';
import { BookingStatus, Role } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // USER → create booking
  @Post()
  @Roles([Role.USER])
  create(@Body() dto: CreateBookingDto, @Req() req) {
    return this.bookingsService.create(dto, req.user.id);
  }

  // USER → my bookings
  @Get('my')
  @Roles([Role.USER])
  myBookings(@Req() req) {
    return this.bookingsService.findByUser(req.user.id);
  }

  // USER → cancel booking
  @Patch(':id/cancel')
  @Roles([Role.USER])
  cancel(@Param('id') id: string, @Req() req) {
    return this.bookingsService.cancel(id, req.user.id);
  }

  // PROVIDER/ADMIN → dashboard
  @Get()
  @Roles([Role.PROVIDER, Role.ADMIN])
  providerBookings(@Req() req) {
    // Admin gets all bookings, provider gets only their bookings
    const providerId =
      req.user.role === Role.ADMIN ? undefined : req.user.providerId;
    return this.bookingsService.findByProvider(providerId);
  }

  // PROVIDER → update status
  @Patch(':id/status')
  @Roles([Role.PROVIDER])
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
    @Req() req,
  ) {
    return this.bookingsService.updateStatus(id, status, req.user.id);
  }
}
