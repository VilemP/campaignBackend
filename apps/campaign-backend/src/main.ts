import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true
    }));
    const port = process.env['PORT'] || 3000;
    
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

bootstrap();