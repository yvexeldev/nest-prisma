import { ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types/";
export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  if (!req && req.cookies) {
    console.log(req.cookies);
    return req.cookies["refresh_token"];
  }
  return null;
};

@Injectable()
export class RefreshTokenFromCookieStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) throw new ForbiddenException("Refresh token noto'gri");
    return {
      ...payload,
      refreshToken,
    };
  }
}
