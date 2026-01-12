import { Queue } from 'bullmq';
import { EventBus, DomainEvent } from '@/application/events';

export class BullMqEventBus implements EventBus {
  constructor(private readonly queue: Queue) {}

  async publish<T>(event: DomainEvent<T>): Promise<void> {
    await this.queue.add(event.type, event.toJSON(), {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
