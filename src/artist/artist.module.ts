import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from "src/prisma/prisma.module";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports:[ArtistService]
})
export class ArtistModule {}
