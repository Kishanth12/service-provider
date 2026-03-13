import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UserQueryDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
