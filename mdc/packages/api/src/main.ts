import { INestApplication, Logger, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService, setupHCRoute } from '@ankora/core';
import { PrismaModule } from '@ankora/models/prisma';
import { apiConfig, ApiConfig } from '@ankora/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const config: ApiConfig = apiConfig;
  admin.initializeApp({
    credential: admin.credential.cert(config.admin as ServiceAccount),
  });
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  const appConfig = app.get(AppConfigService);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
      {
        path: '/api',
        method: RequestMethod.GET,
      },
    ],
  });

  initDocumentation(app, appConfig);

  setupHCRoute(app);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}
const initDocumentation = (
  app: INestApplication,
  appConfig: AppConfigService,
) => {
  if (!appConfig.apiDocumentation.isEnabled) {
    return;
  }

  const devModules = [PrismaModule];

  const configNonDev = new DocumentBuilder()
    .setTitle('Ankora Setup API')
    .setDescription('')
    .addBearerAuth()
    .setVersion('1')
    .addTag('Events')
    .build();

  const documentNonDev = SwaggerModule.createDocument(app, configNonDev, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });
  SwaggerModule.setup('api-docs', app, documentNonDev);

  const configDevSupport = new DocumentBuilder()
    .setTitle('DevSupport Betterleap API')
    .setDescription("Developer's support documentation for Betterleap API")
    .addBearerAuth()
    .setVersion('1')
    .build();

  const documentDevSupport = SwaggerModule.createDocument(
    app,
    configDevSupport,
    { include: devModules },
  );
  SwaggerModule.setup('api-docs', app, documentDevSupport);
};

bootstrap();
