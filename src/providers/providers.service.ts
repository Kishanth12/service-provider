import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateProviderDto } from './dto/update-provider-dto';

@Injectable()
export class ProvidersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async findProviderOrFail(id: string) {
    const provider = await this.databaseService.provider.findUnique({
      where: { id },
      include: { user: true, services: true },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  // Get all providers
  async findAll() {
    return await this.databaseService.provider.findMany({
      select: {
        id: true,
        isApproved: true,
        user: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get one provider by id
  async findOne(id: string) {
    return await this.findProviderOrFail(id);
  }

  async update(id: string, updatedProviderDto: UpdateProviderDto) {
    await this.findProviderOrFail(id);
    return await this.databaseService.provider.update({
      where: { id },
      data: updatedProviderDto,
      select: {
        id: true,
        isApproved: true,
        user: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Approve provider
  async approveProvider(id: string) {
    const provider = await this.findProviderOrFail(id);

    const approvedProvider = await this.databaseService.provider.update({
      where: { id },
      data: { isApproved: true },
      select: {
        id: true,
        isApproved: true,
        user: { select: { name: true, role: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.databaseService.user.update({
      where: { id: provider.userId },
      data: { role: 'PROVIDER' },
    });

    return approvedProvider;
  }

  // Reject provider
  async rejectProvider(id: string) {
    await this.findProviderOrFail(id);

    await this.databaseService.provider.update({
      where: { id },
      data: { isApproved: false },
      select: {
        id: true,
        isApproved: true,
        user: { select: { name: true, role: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    return { message: 'Provider application rejected successfully' };
  }

  async applyForProvider(userId: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new BadRequestException('User not found');

    if (user.role === 'PROVIDER') {
      throw new BadRequestException('You are already a provider');
    }

    const existingProvider = await this.databaseService.provider.findUnique({
      where: { userId },
    });
    if (existingProvider) {
      throw new BadRequestException('You have already applied for provider');
    }

    const provider = await this.databaseService.provider.create({
      data: { userId },
      select: {
        id: true,
        isApproved: true,
        user: { select: { name: true, role: true } },
        createdAt: true,
        updatedAt: true,
      },
    });

    return provider;
  }

  async findPending() {
    return this.databaseService.provider.findMany({
      where: {
        isApproved: false,
      },
      select: {
        id: true,
        isApproved: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
