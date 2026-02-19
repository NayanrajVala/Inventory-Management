import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../Types/jwtUser.type';

export const Getuser = createParamDecorator(
  (data: keyof JwtUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    return data ? user?.[data] : user;
  },
);
