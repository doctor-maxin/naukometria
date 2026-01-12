import fp from 'fastify-plugin';
import { BullMqEventBus } from './bullmq-event-bus';
import { EventBus } from '@/application/events';

const eventBusPlugin = fp(async (app) => {
  const eventBus = new BullMqEventBus(app.queues.importQueue);

  app.decorate('eventBus', eventBus);
});

declare module 'fastify' {
  interface FastifyInstance {
    eventBus: EventBus;
  }
}

export default eventBusPlugin;
