import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaService } from './kafka.service';
import { KafkaGateway } from './kafka.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, KafkaService, KafkaGateway],
})
export class AppModule {}
