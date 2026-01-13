import type { Publication } from '@/generated/prisma/client';
import type { FastifyRequest } from 'fastify';

export interface IUpdatePublicationDto extends Omit<
  Publication,
  'isManuallySet' | 'createdAt' | 'updatedAt' | 'uuid'
> {}

export interface IUpdatePublicationRequest extends FastifyRequest<{
  Params: {
    id: string;
  };
  Body: IUpdatePublicationDto;
}> {}
