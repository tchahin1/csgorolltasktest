import * as React from 'react';
import { appConfig } from '@ankora/config';
import axios from 'axios';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { apiClient } from '../lib/apiClient';

const s3 = new S3({
  region: appConfig.aws.region,
  credentials: {
    accessKeyId: appConfig.aws.accessKey,
    secretAccessKey: appConfig.aws.secretAccessKey,
  },
});

const getVideoDuration = async (file): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
  });
};

export const uploadFile = async (
  e: React.ChangeEvent<HTMLInputElement>,
): Promise<{
  url: string;
  s3FileUrl: string;
  duration: number;
  uploaded: boolean;
  filename: string;
  key: string;
}> => {
  const errorResponse = {
    url: null,
    s3FileUrl: null,
    duration: null,
    uploaded: false,
    filename: null,
    key: null,
  };
  const file = e.target.files?.[0];
  const {
    data: { presignedUrl, key },
  } = await apiClient.file.getPresignedUrl({
    requestBody: { fileName: file.name, contentType: file.type },
  });
  if (!file || !file.type.includes('video')) return errorResponse;

  try {
    const duration = await getVideoDuration(file);
    const url = presignedUrl.split('?')[0];

    const data = await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    const s3FileUrl = `https://${appConfig.aws.bucketName}.s3.${appConfig.aws.region}.amazonaws.com/${file.name}`;

    return {
      url: url,
      s3FileUrl,
      duration,
      uploaded: !!data,
      filename: file.name,
      key,
    };
  } catch (e) {
    return errorResponse;
  }
};

export const getS3SignedUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: appConfig.aws.bucketName,
    Key: key,
  });

  return await getSignedUrl(s3, command);
};
