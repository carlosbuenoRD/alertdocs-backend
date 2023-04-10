import { Activity } from '@/schemas/activities.schema';
import { Document } from '@/schemas/documents.schema';
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

@WebSocketGateway(+process.env.KANBA_PORT || 1080, {
  cors: {
    origin: '*',
  },
})
export class KanbaGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Inicio Kanba socket');
  }

  handleConnection(client: any, ...args: any[]) {
    // console.log('User connected to kanba socket');
  }

  handleDisconnect(client: any) {
    // console.log('ALguien se fue de kanba socket! chao chao');
  }

  @SubscribeMessage('setup')
  handleSetup(@ConnectedSocket() client: Socket, @MessageBody() user: string) {
    console.log('KANBA USER CONNECTED: ', user);
    client.join(user);
  }

  @SubscribeMessage('join document')
  handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() document: string,
  ) {
    client.join(document);
  }

  @SubscribeMessage('change activity')
  handleChangeActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() document: any,
  ) {
    client.in(String(document._id)).emit('changed activity', document._id);
    this.server
      .in(document.participants.map((u) => u._id))
      .emit('changed activity', document._id);
  }
}
