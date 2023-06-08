import { apiConfig } from '@ankora/config';
import { Injectable } from '@nestjs/common/decorators';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';
import dayjs = require('dayjs');
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
@Injectable()
export class FileService {
  async getPresignedUrl(data: GetPresignedUrlDto) {
    const fileInfo = data.fileName.split('.');
    const extension = fileInfo.pop();
    const currentYear = dayjs().get('year').toString();
    const date = dayjs().format('MM/DD');

    const key = `public/${currentYear}/${date}/${uuid()}/video_001.${extension}`;

    const params = {
      Bucket: apiConfig.aws.bucketName,
      Key: key,
      ContentType: data.contentType,
    };

    const client = new S3Client({
      region: apiConfig.aws.region,
      credentials: {
        accessKeyId: apiConfig.aws.accessKey,
        secretAccessKey: apiConfig.aws.secretAccessKey,
      },
    });

    const command = new PutObjectCommand(params);
    const url = (
      await getSignedUrl(client, command, { expiresIn: 30000 })
    ).toString();

    return { presignedUrl: url, key };
  }
}
