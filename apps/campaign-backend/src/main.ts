import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = process.env['PORT'] || 3000;

    const config = new DocumentBuilder()
    .setTitle('Campaign backend')
    .setDescription('The campaign backend API description')
    .setVersion('1.0')
    .addTag('campaigns')
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
    
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

bootstrap();