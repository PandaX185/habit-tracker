import { Module } from '@nestjs/common';
import { FilebaseService } from './filebase.service';

@Module({
  providers: [FilebaseService],
  exports: [FilebaseService],
})
export class FilebaseModule {}