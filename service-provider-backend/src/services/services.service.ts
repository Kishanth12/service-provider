import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role } from '@prisma/client';
import { CreateProviderServiceDto } from './dto/create-provider-service-dto';
import { UpdateProviderServiceDto } from './dto/update-provider-service-dto';
import { CreateServiceDto } from './dto/create-service-dto';
import { UpdateServiceDto } from './dto/update-service-dto';

@Injectable()
export class ServicesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async getProviderIdFromUser(userId: string): Promise<string> {
    const provider = await this.databaseService.provider.findUnique({
      where: { userId },
    });
    if (!provider) throw new ForbiddenException('Provider profile not found.');
    return provider.id;
  }

  //SERVICE TEMPLATES (Admin Only)
  async getAllServiceTemplates(userRole: string) {
    if (userRole === Role.ADMIN) {
      return this.databaseService.serviceTemplate.findMany({
        include: {
          _count: {
            select: { providerServices: true },
          },
        },
      });
    }
    return this.databaseService.serviceTemplate.findMany({
      where: { isActive: true },
    });
  }

  async getServiceTemplateById(id: string) {
    const template = await this.databaseService.serviceTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { providerServices: true },
        },
      },
    });
    if (!template) throw new NotFoundException('Service template not found');
    return template;
  }

  async createServiceTemplate(dto: CreateServiceDto) {
    return this.databaseService.serviceTemplate.create({
      data: dto,
    });
  }

  async updateServiceTemplate(id: string, dto: UpdateServiceDto) {
    const template = await this.databaseService.serviceTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new NotFoundException('Service template not found');

    return this.databaseService.serviceTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async deleteServiceTemplate(id: string) {
    const template = await this.databaseService.serviceTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { providerServices: true },
        },
      },
    });
    if (!template) throw new NotFoundException('Service template not found');

    if (template._count.providerServices > 0) {
      throw new BadRequestException(
        'Cannot delete template with existing provider services',
      );
    }

    return this.databaseService.serviceTemplate.delete({ where: { id } });
  }

  //PROVIDER SERVICES

  async getAllProviderServices(userId: string, userRole: string) {
    if (userRole === Role.ADMIN) {
      return this.databaseService.providerService.findMany({
        include: {
          provider: { include: { user: true } },
          serviceTemplate: true,
        },
      });
    }

    const providerId = await this.getProviderIdFromUser(userId);
    return this.databaseService.providerService.findMany({
      where: { providerId },
      include: { serviceTemplate: true },
    });
  }

  async getProviderServiceById(userId: string, userRole: string, id: string) {
    const providerService =
      await this.databaseService.providerService.findUnique({
        where: { id },
        include: {
          serviceTemplate: true,
          provider: { include: { user: true } },
        },
      });

    if (!providerService)
      throw new NotFoundException('Provider service not found');

    // USER: Can only view available services
    if (userRole === Role.USER) {
      if (
        !providerService.isAvailable ||
        !providerService.serviceTemplate.isActive
      ) {
        throw new NotFoundException('Service is not available');
      }
      return providerService;
    }

    // PROVIDER: Verify ownership
    if (userRole === Role.PROVIDER) {
      const providerId = await this.getProviderIdFromUser(userId);
      if (providerService.providerId !== providerId) {
        throw new ForbiddenException('Unauthorized access to this service');
      }
    }

    // ADMIN: Can view any service
    return providerService;
  }

  async createProviderService(userId: string, dto: CreateProviderServiceDto) {
    const providerId = await this.getProviderIdFromUser(userId);

    // Check if template exists and is active
    const template = await this.databaseService.serviceTemplate.findUnique({
      where: { id: dto.serviceTemplateId },
    });
    if (!template) throw new NotFoundException('Service template not found');
    if (!template.isActive)
      throw new BadRequestException('Service template is not active');

    // Check if provider already has this service
    const existing = await this.databaseService.providerService.findUnique({
      where: {
        providerId_serviceTemplateId: {
          providerId,
          serviceTemplateId: dto.serviceTemplateId,
        },
      },
    });
    if (existing)
      throw new BadRequestException('You already offer this service');

    try {
      return await this.databaseService.providerService.create({
        data: {
          providerId,
          serviceTemplateId: dto.serviceTemplateId,
          price: dto.price,
          isAvailable: dto.isAvailable ?? true,
        },
        include: { serviceTemplate: true },
      });
    } catch (err) {
      console.error('Prisma error:', err);
      throw err;
    }
  }

  async updateProviderService(
    userId: string,
    userRole: string,
    id: string,
    dto: UpdateProviderServiceDto,
  ) {
    // If NOT Admin, verify ownership
    if (userRole !== Role.ADMIN) {
      const providerId = await this.getProviderIdFromUser(userId);
      const service = await this.databaseService.providerService.findFirst({
        where: { id, providerId },
      });
      if (!service)
        throw new NotFoundException('Service not found or unauthorized');
    }

    return this.databaseService.providerService.update({
      where: { id },
      data: dto,
      include: { serviceTemplate: true },
    });
  }

  async deleteProviderService(userId: string, userRole: string, id: string) {
    if (userRole !== Role.ADMIN) {
      const providerId = await this.getProviderIdFromUser(userId);
      const service = await this.databaseService.providerService.findFirst({
        where: { id, providerId },
      });
      if (!service)
        throw new NotFoundException('Service not found or unauthorized');
    }

    // Check for existing bookings
    const bookingsCount = await this.databaseService.booking.count({
      where: { providerServiceId: id },
    });
    if (bookingsCount > 0) {
      throw new BadRequestException(
        'Cannot delete service with existing bookings. Consider marking it as unavailable instead.',
      );
    }

    return this.databaseService.providerService.delete({ where: { id } });
  }

  //PUBLIC: Get Available Provider Services

  async getAvailableProviderServices(serviceTemplateId?: string) {
    return this.databaseService.providerService.findMany({
      where: {
        isAvailable: true,
        serviceTemplate: { isActive: true },
        ...(serviceTemplateId && { serviceTemplateId }),
      },
      include: {
        serviceTemplate: true,
        provider: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  }
}
