import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AccessTokenGuard } from "src/common/guards";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessTokenStrategy } from "./strategies/acces-token.strategy";
import { RefreshTokenFromBearerStrategy } from "./strategies/refresh-token-bearer.strategy";
import { RefreshTokenFromCookieStrategy } from "./strategies/refresh-token-cookie.strategy";

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenFromCookieStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AuthModule {}
