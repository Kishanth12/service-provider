import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(role?: Role) {
    const users = await this.databaseService.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (role && users.length === 0) {
      throw new NotFoundException('User role not found');
    }

    return users;
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User Not Found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async update(id: string, updatedUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updatedUserDto.email) {
      const emailExists = await this.databaseService.user.findUnique({
        where: { email: updatedUserDto.email },
      });

      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    return this.databaseService.user.update({
      where: { id },
      data: updatedUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not Found');
    return await this.databaseService.user.delete({ where: { id } });
  }
}
