// src/filebase/filebase.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FilebaseService {
  private readonly s3: S3Client;
  private readonly bucket = process.env.FILEBASE_BUCKET!;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-1', 
      endpoint: process.env.S3_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.FILEBASE_ACCESS_KEY!,
        secretAccessKey: process.env.FILEBASE_SECRET_KEY!,
      },
    });
  }

  async uploadFile(key: string, body: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    if (body.length > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB');
    }

    const validContentTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validContentTypes.includes(contentType)) {
      throw new Error('Invalid content type');
    }

    await this.s3.send(command);
    return `${process.env.S3_ENDPOINT!}/${this.bucket}/${key}`;
  }

  async getFileUrl(key: string) {
    return `${process.env.S3_ENDPOINT!}/${this.bucket}/${key}`;
  }
}
