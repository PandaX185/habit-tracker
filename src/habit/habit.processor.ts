import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@Processor('habit-reactivation')
export class HabitProcessor extends WorkerHost {
  private readonly logger = new Logger(HabitProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ habitId: string }>): Promise<void> {
    const { habitId } = job.data;

    try {
      this.logger.log(`Reactivating habit ${habitId}`);

      await this.prisma.habit.update({
        where: { id: habitId },
        data: { isActive: true },
      });

      this.logger.log(`Successfully reactivated habit ${habitId}`);
    } catch (error) {
      this.logger.error(`Failed to reactivate habit ${habitId}:`, error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed with error: ${err.message}`);
  }
}
