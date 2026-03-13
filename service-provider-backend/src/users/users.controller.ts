import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query.role);
  }

  @Get('me') // GET /users/me — must be before :id
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return this.usersService.findOne(req.user.id);
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
