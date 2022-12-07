import { ForbiddenException, Injectable } from "@nestjs/common";
import { CreateAlbumDto, EditAlbumDto } from "./dto";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}
  async addAlbum(albumDto: CreateAlbumDto, req: Request) {
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
      throw new ForbiddenException("Access Denied for adding Album!");

    const newAlbum = await this.prismaService.album.create({
      data: {
        name: albumDto.name,
        artist_id: Number(albumDto.artist_id),
        genre: albumDto.genre,
      },
      include: {
        artist: true,
      },
    });
    return newAlbum;
  }

  async getAlbumByID(id: number, req: Request) {
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

    const album = await this.prismaService.album.findUnique({
      where: { id: +id },
      include: { artist: true },
    });
    return album;
  }

  async getAlbums(req: Request) {
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

    const album = await this.prismaService.album.findMany({
      include: { artist: true },
    });
    return album;
  }

  async editAlbum(id: number, editAlbumDto: EditAlbumDto, req: Request) {
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

    const editedAlbum = await this.prismaService.album.update({
      where: { id: +id },
      data: {
        name: editAlbumDto.name,
        genre: editAlbumDto.genre,
        artist_id: editAlbumDto.artist_id,
      },
      include: {
        artist: true,
      },
    });
    return editedAlbum;
  }

  async deleteAlbum(id: number, req: Request) {
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
    if (!tokenMatches) throw new ForbiddenException("Access Denied for Album!");
    const isExists = await this.prismaService.album.findUnique({
      where: { id: +id },
    });
    if (!isExists) throw new ForbiddenException("THIS ID NOT FOUND!");
    const deleted = await this.prismaService.album.delete({
      where: {
        id: +id,
      },
      include: {
        artist: true,
      },
    });
    console.log(deleted);
    // if (deleted ) throw new ForbiddenException("Bunday ID da Artist yoq!");
    return deleted;
  }
}
