import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Socket } from 'socket.io';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient<Socket & { user?: any }>();
    return client.user;
  },
);
