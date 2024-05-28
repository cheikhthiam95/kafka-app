import { Injectable } from '@nestjs/common';
import * as kafka from 'kafka-node';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class KafkaService {
  private producer: kafka.Producer;
  private consumer: kafka.Consumer;
  private messages: string[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {
    const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
    this.producer = new kafka.Producer(client);
    this.consumer = new kafka.Consumer(
      client,
      [{ topic: 'my-topic', partition: 0 }],
      { autoCommit: true }
    );

    this.consumer.on('message', (message) => {
      console.log('Received message:', message);
      const messageValue = typeof message.value === 'string' ? message.value : message.value.toString();
      this.messages.push(messageValue);
      this.eventEmitter.emit('message.received', this.messages);
    });

    this.consumer.on('error', (err) => {
      console.error('Consumer error:', err);
    });
  }

  async sendMessage(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Sending message:', message);
      this.producer.send(
        [{ topic: 'my-topic', messages: [message] }],
        (err, data) => {
          if (err) {
            console.error('Producer error:', err);
            reject(err);
          } else {
            console.log('Message sent:', data);
            resolve(data);
          }
        }
      );
    });
  }

  getMessages(): string[] {
    return this.messages;
  }
}
