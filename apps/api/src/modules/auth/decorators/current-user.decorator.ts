import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
}

/**
 * Decorator to get the current authenticated user from request
 * Usage: @CurrentUser() user: CurrentUserData
 */
export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
