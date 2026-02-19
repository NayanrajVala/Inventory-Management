import { BadRequestException, Injectable,Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name)
  async findByEmail(email: string) {
    try{
      return await this.prisma.user.findUnique({
      where: { email },
    });
    }
    catch(error){
      this.logger.error("Error Finding user");
      throw new BadRequestException("Error in finding user");
    }
    
  }

  async create(data: Prisma.UserCreateInput) {
    try{
          return this.prisma.user.create({ data });
    } catch(error){
      this.logger.error("Error creating user");
      throw new BadRequestException("Error creating user");
    }
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
      this.logger.error(err);
      throw new BadRequestException("Error verifying user");
    }
  }
}
