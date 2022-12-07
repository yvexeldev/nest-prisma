import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export class RefreshTokenGuard extends AuthGuard("refresh-jwt") {
  constructor() {
    super();
  }
}
