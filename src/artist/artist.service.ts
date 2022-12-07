import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateArtistDto, EdotArtistDto } from "./dto";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class ArtistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}
  async addArtist(artistDto: CreateArtistDto, req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ForbiddenException("Access Denied!");

    const decoded = await this.jwtService.decode(refreshToken);
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!tokenMatches)
      throw new ForbiddenException("Access Denied for adding Artist!");

    const newArtist = await this.prismaService.artist.create({
      data: {
        name: artistDto.name,
      },
    });
    return newArtist;
  }

  async getArtistByID(id: number, req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ForbiddenException("Access Denied!");
    const decoded = await this.jwtService.decode(refreshToken);
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!tokenMatches)
      throw new ForbiddenException("Access Denied for getting Artist!");

    const artist = await this.prismaService.artist.findUnique({
      where: { id: +id },
    });
    return artist;
  }

  async getArtists(req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ForbiddenException("Access Denied!");
    const decoded = await this.jwtService.decode(refreshToken);
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!tokenMatches)
      throw new ForbiddenException("Access Denied for getting Artists!");

    const artists = await this.prismaService.artist.findMany();
    return artists;
  }

  async editArtist(id: number, editArtistDto: EdotArtistDto, req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ForbiddenException("Access Denied!");
    const decoded = await this.jwtService.decode(refreshToken);
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!tokenMatches)
      throw new ForbiddenException("Access Denied for editing Artists!");

    const editedArtist = await this.prismaService.artist.update({
      where: { id: +id },
      data: {
        name: editArtistDto.name,
      },
    });
    return editedArtist;
  }

  async deleteArtist(id: number, req: Request) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new ForbiddenException("Access Denied!");
    const decoded = await this.jwtService.decode(refreshToken);
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    const tokenMatches = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!tokenMatches)
      throw new ForbiddenException("Access Denied for Artists!");
    const isExists = await this.prismaService.artist.findUnique({
      where: { id: +id },
    });
    if (!isExists) throw new ForbiddenException("THIS ID NOT FOUND!");
    const deleted = await this.prismaService.artist.delete({
      where: {
        id: +id,
      },
    });
    console.log(deleted);
    // if (deleted ) throw new ForbiddenException("Bunday ID da Artist yoq!");
    return deleted;
  }
}
