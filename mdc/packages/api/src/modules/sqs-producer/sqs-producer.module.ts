import { apiConfig } from '@ankora/config';
import { Module } from '@nestjs/common/decorators';
import { SqsProducerService } from './sqs-producer.service';
import { SqsModule, SqsQueueType } from '@nestjs-packages/sqs';

@Module({
  imports: [
    SqsModule.registerQueue({
      name: apiConfig.aws.queueName,
      type: SqsQueueType.Producer,
      consumerOptions: {},
      producerOptions: {},
    }),
  ],
  controllers: [],
  providers: [SqsProducerService],
  exports: [SqsProducerService],
})
export class SqsProducerModule {}
