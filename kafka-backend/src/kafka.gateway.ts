import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { KafkaService } from './kafka.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class KafkaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly kafkaService: KafkaService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
    // Send the current messages to the connected client
    client.emit('messages', this.kafkaService.getMessages());
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    await this.kafkaService.sendMessage(message);
    const messages = await this.kafkaService.getMessages();
    this.server.emit('messages', messages);
  }

  @OnEvent('message.received')
  handleMessageReceived(messages: string[]) {
    this.server.emit('messages', messages);
  }
}
