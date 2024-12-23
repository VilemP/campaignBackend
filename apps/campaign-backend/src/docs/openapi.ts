
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '../app.module.js';

import { writeFileSync } from 'fs';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {

  const app = await NestFactory.create(AppModule);



  const config = new DocumentBuilder()

    .setTitle('Campaign Backend API')

    .setDescription('Your API description')

    .setVersion('1.0')

    .addTag('your-tag')

    .build();



  const document = SwaggerModule.createDocument(app, config);

  

  // Write the Swagger JSON file

  writeFileSync(

    join(__dirname, 'swagger.json'),

    JSON.stringify(document, null, 2)

  );



  await app.close();

}



bootstrap();