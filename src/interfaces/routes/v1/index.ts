import { FastifyPluginAsync } from 'fastify';
import { RincController } from '../../controllers/rinc';

const v1Routes: FastifyPluginAsync = async (fastify) => {
  const rincController = new RincController(fastify);

  fastify.post('/rinc/import', rincController.processZip.bind(rincController));
  fastify.get('/rinc/import/:id', rincController.retrieveProcessImport.bind(rincController));
};

export default v1Routes;
