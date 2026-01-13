import { FastifyPluginAsync } from 'fastify';
import { RincController } from '../../controllers/rinc';
import { PublicationController } from '@/interfaces/controllers/publication';
import { IUpdatePublicationRequest } from '@/interfaces/dto/update-publication.request';

const v1Routes: FastifyPluginAsync = async (fastify) => {
  const rincController = new RincController(fastify);
  const publicationController = new PublicationController(fastify);

  fastify.post('/rinc/import', rincController.processZip.bind(rincController));
  fastify.get('/rinc/import/:id', rincController.retrieveProcessImport.bind(rincController));

  fastify.get('/publication', publicationController.listPublications.bind(publicationController));
  fastify.get(
    '/publication/:id',
    publicationController.retrievePublication.bind(publicationController),
  );
  fastify.put(
    '/publication/:id',
    publicationController.updatePublication.bind(publicationController),
  );
};

export default v1Routes;
