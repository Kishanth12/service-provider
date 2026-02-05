import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { UpdateProviderDto } from './dto/update-provider-dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async findAll() {
    const providers = await this.providersService.findAll();
    return providers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const provider = await this.providersService.findOne(id);
    return provider;
  }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateProviderDto: UpdateProviderDto,
  // ) {
  //   const provider = await this.providersService.update(id, updateProviderDto);
  //   return { message: 'Provider updated successfully', data: provider };
  // }

  // @Patch(':id/approve')
  // async approve(@Param('id') id: string) {
  //   const provider = await this.providersService.approveProvider(id);
  //   return { message: 'Provider approved successfully', data: provider };
  // }

  // @Patch(':id/reject')
  // async reject(@Param('id') id: string) {
  //   const result = await this.providersService.rejectProvider(id);
  //   return { message: result.message };
  // }

  // @Post('apply/:userId')
  // async apply(@Param('userId') userId: string) {
  //   const provider = await this.providersService.applyForProvider(userId);
  //   return {
  //     message: 'Provider application submitted successfully',
  //     data: provider,
  //   };
  // }
  // @Get('pending/applications')
  // async findPending() {
  //   const providers = await this.providersService.findPending();
  //   return {
  //     message: 'Pending provider applications retrieved successfully',
  //     data: providers,
  //   };
  // }
}
