import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from "src/common/decorators";
import { RefreshTokenGuard } from "src/common/guards";
import { AuthService } from "./auth.service";
import { AdminDto } from "./dto";
import { Response } from "express";
import { Tokens } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post("signup")
  async signup(
    @Body() authDto: AdminDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    return this.authService.signup(authDto, res);
  }

  @Public()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() authDto: AdminDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    return await this.authService.signin(authDto, res);
  }

  @Public()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<boolean> {
    res.clearCookie("refresh_token");
    return this.authService.logout(userId, res);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken, res);
  }
}
