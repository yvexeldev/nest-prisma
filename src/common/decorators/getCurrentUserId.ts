import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { decompressFromBase64, DMMF } from '@prisma/client/runtime';
import { deepStrictEqual } from 'assert';
import { execFileSync } from 'child_process';
import { getHashes } from 'crypto';
import { setDefaultResultOrder } from 'dns';
import { getFileInfo } from 'prettier';
import { endWith } from 'rxjs';
import { JwtPayload } from "src/auth/types";

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    console.log(user);
    return user.sub;
  }
);