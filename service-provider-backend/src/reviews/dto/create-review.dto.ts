import { IsString, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  bookingId: string; // the booking being reviewed

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment?: string;
}
