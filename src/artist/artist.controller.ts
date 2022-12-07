import {
  Body,
  Controller,
  Post,
  Req,
  Param,
  Get,
  Patch,
  Delete,
} from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { CreateArtistDto, EdotArtistDto } from "./dto";
import { Request } from "express";
import { Tokens } from "src/auth/types";
import { Public } from "src/common/decorators";
@Controller("artist")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
  @Public()
  @Post("/add")
  async addArtist(@Body() artistDto: CreateArtistDto, @Req() req: Request) {
    return this.artistService.addArtist(artistDto, req);
  }

  @Public()
  @Get("/:id")
  async getArtistById(@Param("id") id: number, @Req() req: Request) {
    return this.artistService.getArtistByID(id, req);
  }
  @Public()
  @Get()
  async getArtists(@Req() req: Request) {
    return this.artistService.getArtists(req);
  }

  @Public()
  @Patch("/edit/:id")
  async editArtist(
    @Param("id") id: number,
    @Body() editArtistdto: EdotArtistDto,
    @Req() req: Request
  ) {
    return this.artistService.editArtist(id, editArtistdto, req);
  }

  @Public()
  @Delete("/del/:id")
  async delArtist(@Param("id") id: number, @Req() req: Request) {
    return this.artistService.deleteArtist(id, req);
  }
}
