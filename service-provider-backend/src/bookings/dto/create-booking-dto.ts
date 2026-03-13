import { IsUUID, IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  providerServiceId: string;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string; 
}
