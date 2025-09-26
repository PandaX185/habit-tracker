import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { BadgeModule } from '../badges/badge.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [BadgeModule],
  controllers: [FriendshipController],
  providers: [FriendshipService, PrismaService],
  exports: [FriendshipService],
})
export class FriendshipModule {}