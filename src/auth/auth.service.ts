import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AdminDto } from "./dto";
import * as bcrypt from "bcryptjs";
import { JwtPayload, Tokens } from "./types";
import { Response } from "express";
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}
  async signup(adminDto: AdminDto, res: Response): Promise<Tokens> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        email: adminDto.email,
      },
    });
    if (admin) {
      throw new BadRequestException("Bunday Email Mavjud");
    }
    const hashedPassword = await bcrypt.hash(adminDto.password, 7);
    const newAdmin = await this.prismaService.admin.create({
      data: {
        name: adminDto.name,
        email: adminDto.email,
        password: hashedPassword,
      },
    });
    const tokens = await this.getTokens(newAdmin.id, newAdmin.email);
    await this.updateRefreshTokenHash(newAdmin.id, tokens.refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }
  // constructor(
  //   private prismaService: PrismaService,
  //   private jwtService: JwtService
  // ) {}
  // async signup(authDto: AuthDto, res: Response): Promise<Tokens> {
  //   const candidate = await this.prismaService.admin.findUnique({
  //     where: {
  //       email: authDto.email
  //     }
  //   });
  //   if (candidate) {
  //     throw new BadRequestException("Bunday Email mavjud");
  //   }
  //   const hashedPassword = await bcrypt.hash(authDto.password, 7);
  //   const newUser = await this.prismaService.admin.create({
  //     data: {
  //       email: authDto.email,
  //       password: hashedPassword,
  //     },
  //   });
  //   const tokens = await this.getTokens(newUser.id, newUser.email);
  //   await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
  //   res.cookie("refresh_token", tokens.refresh_token, {
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //     httpOnly: true,
  //   });
  //   return tokens;
  // }
  async getTokens(adminId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: adminId,
      email: email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  // async getTokens(userId: number, email: string): Promise<Tokens> {
  //   const jwtPayload: JwtPayload = {
  //     sub: userId,
  //     email: email,
  //   };
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(jwtPayload, {
  //       secret: process.env.ACCESS_TOKEN_KEY,
  //       expiresIn: process.env.ACCESS_TOKEN_TIME,
  //     }),
  //     this.jwtService.signAsync(jwtPayload, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //       expiresIn: process.env.REFRESH_TOKEN_TIME,
  //     }),
  //   ]);
  //   return {
  //     access_token: accessToken,
  //     refresh_token: refreshToken,
  //   };
  // }

  async updateRefreshTokenHash(
    adminId: number,
    refreshToken: string
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.prismaService.admin.update({
      where: {
        id: adminId,
      },
      data: {
        hashedRefreshToken: hashedRefreshToken,
      },
    });
  }
  // async updateRefreshTokenHash(
  //   userId: number,
  //   refreshToken: string
  // ): Promise<void> {
  //   const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
  //   await this.prismaService.user.update({
  //     where: {
  //       id: userId,
  //     },
  //     data: {
  //       hashedRefreshtoken: hashedRefreshToken,
  //     },
  //   });
  // }

  async signin(adminDto: AdminDto, res: Response): Promise<Tokens> {
    const { email, password } = adminDto;
    const admin = await this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
    if (!admin) throw new ForbiddenException("Access Denied!");
    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) throw new ForbiddenException("Access Denied!!");
    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRefreshTokenHash(admin.id, tokens.refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }
  // async signin(authDto: AuthDto, res: Response): Promise<Tokens> {
  //   const { email, password } = authDto;
  //   const user = await this.prismaService.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (!user) throw new ForbiddenException("Access Denied!");
  //   const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
  //   if (!passwordMatches) throw new ForbiddenException("Access Denied!!");

  //   const tokens = await this.getTokens(user.id, user.email);
  //   await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
  //   res.cookie("refresh_token", tokens.refresh_token, {
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //     httpOnly: true,
  //   });
  //   return tokens;
  // }
  async logout(adminId: number, res: Response): Promise<boolean> {
    const admin = await this.prismaService.admin.updateMany({
      where: {
        id: +adminId,
        hashedRefreshToken: {
          not: null,
        },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    if (admin.count == 0) throw new ForbiddenException("Access Denied!!!");
    res.clearCookie("refresh_token");
    return true;
  }
  // async logout(userId: number, res: Response): Promise<boolean> {
  //   const user = await this.prismaService.user.updateMany({
  //     where: {
  //       id: Number(userId),
  //       hashedRefreshtoken: {
  //         not: null,
  //       },
  //     },
  //     data: {
  //       hashedRefreshtoken: null,
  //     },
  //   });
  //   if (user.count == 0) throw new ForbiddenException("Access Denieed!");
  //   res.clearCookie("refresh_token");
  //   return true;
  // }
  async refreshTokens(
    adminId: number,
    refreshToken: string,
    res: Response
  ): Promise<Tokens> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id: +adminId },
    });
    if (!admin || !admin.hashedRefreshToken)
      throw new ForbiddenException("Access Denied!!!!");

    const refresh_tokenMatch = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );
    if (!refresh_tokenMatch) throw new ForbiddenException("!Access Denied");

    const tokens = await this.getTokens(admin.id, admin.email);
    await this.updateRefreshTokenHash(admin.id, tokens.refresh_token);
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return tokens;
  }
  // async refreshToken(
  //   userId: number,
  //   refreshToken: string,
  //   res: Response
  // ): Promise<Tokens> {
  //   const user = await this.prismaService.user.findUnique({
  //     where: { id: +userId },
  //   });
  //   if (!user || !user.hashedRefreshtoken)
  //     throw new ForbiddenException("Access Denied1");

  //   const refresh_tokenMatch = await bcrypt.compare(
  //     refreshToken,
  //     user.hashedRefreshtoken
  //   );
  //   if (!refresh_tokenMatch) throw new ForbiddenException("Access Denied2");

  //   const tokens = await this.getTokens(user.id, user.email);
  //   await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
  //   res.cookie("refresh_token", tokens.refresh_token, {
  //     maxAge: 7 * 24 * 60 * 60 * 1000,
  //     httpOnly: true,
  //   });
  //   return tokens;
  // }
}
