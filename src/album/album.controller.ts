import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { Public } from "src/common/decorators";
import { AlbumService } from "./album.service";
import { CreateAlbumDto, EditAlbumDto } from "./dto";

@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}
  @Public()
  @Post("/add")
  async addAlbum(@Body() albumDto: CreateAlbumDto, @Req() req: Request) {
    return this.albumService.addAlbum(albumDto, req);
  }

  @Public()
  @Get()
  async getAlbums(@Req() req: Request) {
    return this.albumService.getAlbums(req);
  }

  @Public()
  @Get("/:id")
  async getAlbumByID(@Param("id") id: number, @Req() req: Request) {
    return this.albumService.getAlbumByID(id, req);
  }
  @Public()
  @Patch("/:id")
  async editAlbum(
    @Param("id") id: number,
    @Body() editAlbumDto: EditAlbumDto,
    @Req() req: Request
  ) {
    return this.albumService.editAlbum(id, editAlbumDto, req);
  }

  @Public()
  @Delete("/:id")
  async deleteAlbum(@Param("id") id: number, @Req() req: Request) {
    return this.albumService.deleteAlbum(id, req);
  }
}
