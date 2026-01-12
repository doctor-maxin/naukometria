import fp from 'fastify-plugin';
import { FileValidator } from '@/infrastructure/plugins/validators/interfaces';
import { FileTypeValidator } from './file-type-validator';

const validatorPlugin = fp(async (app) => {
  const fileValidator: FileValidator = new FileTypeValidator();

  app.decorate('fileValidator', fileValidator);
});

declare module 'fastify' {
  interface FastifyInstance {
    fileValidator: FileValidator;
  }
}

export default validatorPlugin;
