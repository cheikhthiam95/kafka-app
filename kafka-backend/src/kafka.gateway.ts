import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { KafkaService } from './kafka.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class KafkaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly kafkaService: KafkaService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send the current messages to the connected client
    client.emit('messages', this.kafkaService.getMessages());
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { message: string }): Promise<void> {
    await this.kafkaService.sendMessage(payload.message);
    const messages = this.kafkaService.getMessages();
    this.server.emit('messages', messages);
  }

  @OnEvent('message.received')
  handleMessageReceived(messages: string[]) {
    this.server.emit('messages', messages);
  }
}
