import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma-generated/enums';

export class UserQueryDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
