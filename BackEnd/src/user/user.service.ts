import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async verifyUser(email: string) {
    console.log('verifyUser function hit');
    try {
      return this.prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  }
}
