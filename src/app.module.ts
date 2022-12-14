import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ArtistController } from './artist/artist.controller';
import { ArtistModule } from './artist/artist.module';
import { JwtService } from '@nestjs/jwt';
// import { ArtistService } from './artist/artist.service';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PrismaModule,
    AuthModule,
    ArtistModule,
    AlbumModule,
  ],
  controllers: [AppController, ArtistController],
  providers: [AppService],
})
export class AppModule {}
