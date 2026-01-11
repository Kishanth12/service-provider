import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Role } from '@prisma-generated/enums';
import { CreateServiceDto } from './dto/create-service-dto';
import { UpdateServiceDto } from './dto/update-service-dto';
import { CreateProviderServiceDto } from './dto/create-provider-service-dto';
import { UpdateProviderServiceDto } from './dto/update-provider-service-dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  //SERVICE TEMPLATES (Admin Only)

  @Get('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.PROVIDER])
  async getServiceTemplates(@GetUser('role') role: string) {
    return this.servicesService.getAllServiceTemplates(role);
  }

  @Get('templates/:id')
  @UseGuards(JwtAuthGuard)
  async getServiceTemplateById(@Param('id') id: string) {
    return this.servicesService.getServiceTemplateById(id);
  }

  @Post('templates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async createServiceTemplate(@Body() dto: CreateServiceDto) {
    return this.servicesService.createServiceTemplate(dto);
  }

  @Patch('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async updateServiceTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.updateServiceTemplate(id, dto);
  }

  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN])
  async deleteServiceTemplate(@Param('id') id: string) {
    return this.servicesService.deleteServiceTemplate(id);
  }

  //PROVIDER SERVICES

  @Get('provider-services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.PROVIDER])
  async getProviderServices(
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
  ) {
    return this.servicesService.getAllProviderServices(userId, role);
  }

  @Get('provider-services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.PROVIDER])
  async getProviderServiceById(
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @Param('id') id: string,
  ) {
    return this.servicesService.getProviderServiceById(userId, role, id);
  }

  @Post('provider-services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.PROVIDER])
  async createProviderService(
    @GetUser('id') userId: string,
    @Body() dto: CreateProviderServiceDto,
  ) {
    return this.servicesService.createProviderService(userId, dto);
  }

  @Patch('provider-services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.PROVIDER])
  async updateProviderService(
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @Param('id') id: string,
    @Body() dto: UpdateProviderServiceDto,
  ) {
    return this.servicesService.updateProviderService(userId, role, id, dto);
  }

  @Delete('provider-services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.ADMIN, Role.PROVIDER])
  async deleteProviderService(
    @GetUser('id') userId: string,
    @GetUser('role') role: string,
    @Param('id') id: string,
  ) {
    return this.servicesService.deleteProviderService(userId, role, id);
  }

  // PUBLIC: Available Services for Booking 

  @Get('available')
  async getAvailableServices(
    @Query('serviceTemplateId') serviceTemplateId?: string,
  ) {
    return this.servicesService.getAvailableProviderServices(serviceTemplateId);
  }
}
