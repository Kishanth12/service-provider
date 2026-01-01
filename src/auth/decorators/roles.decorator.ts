import { Reflector } from '@nestjs/core';
import { Role } from '@prisma-generated/enums';

// This is now a typed reference, not just a string key
export const Roles = Reflector.createDecorator<Role[]>();