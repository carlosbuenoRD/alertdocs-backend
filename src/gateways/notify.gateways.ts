import { Activity } from '@/schemas/activities.schema';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(81, {
  cors: {
    origin: '*',
  },
})
export class NotifyGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Inicio notify socket');
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('User connected to notify socket');
  }

  handleDisconnect(client: any) {
    console.log('ALguien se fue del notify socket! chao chao');
  }

  @SubscribeMessage('setup')
  handleSetup(@ConnectedSocket() client: Socket, @MessageBody() user: string) {
    console.log('Setup user: ', user)
    client.join(user);
  }

  @SubscribeMessage('notify upcoming activity')
  handleUpcomingActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    client.in(user).emit('upcoming activity');
  }

  @SubscribeMessage('notify ready activity')
  handleReadyActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    client.in(user).emit('ready activity');
  }

  @SubscribeMessage('notify devolucion created')
  handleCreatedDevolucion(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    client.in(user).emit('devolucion created');
  }

  @SubscribeMessage('notify devolucion ended')
  handleEndedDevolucion(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    client.in(user).emit('devolucion ended');
  }
}
