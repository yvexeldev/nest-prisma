import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 8000;
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, () => {
      console.log(`Server run ${PORT}-port`);
    });
  } catch (err) {
    console.log(err);
    return new HttpException(
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
bootstrap();
