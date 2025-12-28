import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user-query.dto.ts';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query.role);
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id') //PATCH /users/:id
  async update(
    @Param('id') id: string,
    @Body()
    userUpdateDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, userUpdateDto);
    return { message: 'User updated successfully', user };
  }

  @Delete(':id') //DELETE /users/:id
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
