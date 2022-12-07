import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from "src/prisma/prisma.module";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";

@Module({
  imports: [PrismaModule, JwtModule],

  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
