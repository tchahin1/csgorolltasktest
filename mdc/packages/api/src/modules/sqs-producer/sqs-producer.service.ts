import { apiConfig } from '@ankora/config';
import { SqsService } from '@nestjs-packages/sqs';
import { Injectable } from '@nestjs/common/decorators';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SqsProducerService {
  constructor(private readonly sqsService: SqsService) {}

  async findKeyMoments(videoAwsKey: string, userId: string, sessionId: string) {
    const callbackUrl = {
      worker_ai: `${apiConfig.apiUrl}/api/key-moment/${sessionId}`,
    };

    const callbacks = JSON.stringify(callbackUrl);

    const params = {
      id: uuid(),
      body: `Message sent at ${Date.now()}`,
      messageAttributes: {
        Bucket: {
          DataType: 'String',
          StringValue: apiConfig.aws.bucketName,
        },
        Video: {
          DataType: 'String',
          StringValue: videoAwsKey,
        },
        UserId: {
          DataType: 'String',
          StringValue: userId,
        },
        SessionId: {
          DataType: 'String',
          StringValue: sessionId,
        },
        ResultsPostUrl: {
          DataType: 'String',
          StringValue: callbacks,
        },
        ResultsAuthorizationHeader: {
          DataType: 'String',
          StringValue:
            'eyJhbGciOiJIUzI1NiJ9.V09SS0VS.tUEeemOLsVnlT9t4r1XhGuqMRQ_qwylSj5cHBkcgTa4',
        },
        Score: {
          DataType: 'String',
          StringValue: 'NA',
        },
        Time: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
        session_type: {
          DataType: 'String',
          StringValue: 'match',
        },
        side_changing: {
          DataType: 'String',
          StringValue: 'false',
        },
      },
      QueueUrl: `${apiConfig.aws.queueUrl}/${apiConfig.aws.accessKey}/${apiConfig.aws.queueName}`,
    };

    return this.sqsService.send(apiConfig.aws.queueName, params);
  }
}
