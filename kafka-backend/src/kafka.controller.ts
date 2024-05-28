import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Post('send')
  async sendMessage(@Body('message') message: string) {
    try {
      await this.kafkaService.sendMessage(message);
      return { status: 'Message sent' };
    } catch (error) {
      throw new HttpException('Failed to send message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('messages')
  async getMessages() {
    try {
      const messages = await this.kafkaService.getMessages();
      return messages;
    } catch (error) {
      throw new HttpException('Failed to fetch messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
