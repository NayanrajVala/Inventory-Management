import { Injectable,Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name)
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async verifyUser(email: string) {
    try {
      return this.prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
        },
      });
    } catch (err: any) {
      Logger.error(err);
    }
  }
}
