import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { NotificationsService } from './notifications.service';

@WebSocketGateway(+process.env.NOTIFICATION_PORT || 1081, {
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  constructor(private readonly notificationsService: NotificationsService) {}

  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Inicio notify socket');
  }

  handleConnection(client: any, ...args: any[]) {
    // console.log('User connected to notify socket');
  }

  handleDisconnect(client: any) {
    // console.log('ALguien se fue del notify socket! chao chao');
  }

  @SubscribeMessage('setup')
  handleSetup(@ConnectedSocket() client: Socket, @MessageBody() user: string) {
    console.log('NOTIFY USER CONNECTED: ', user);
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
  async handleReadyActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    await this.notificationsService.create({
      user,
      message: 'Tu actividad esta lista para empezar',
      from: 'me',
    });
    client.in(user).emit('ready activity');
  }

  @SubscribeMessage('notify devolucion created')
  async handleCreatedDevolucion(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    await this.notificationsService.create({
      user,
      message: 'Has recibido una devolucion',
      from: 'me',
    });
    client.in(user).emit('devolucion created');
  }

  @SubscribeMessage('notify devolucion ended')
  async handleEndedDevolucion(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    await this.notificationsService.create({
      user,
      message: 'Devolucion terminada puedes continuar',
      from: 'me',
    });
    client.in(user).emit('devolucion ended');
  }

  @SubscribeMessage('create document')
  async handleCreateDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() document,
  ) {
    this.server.emit('created document');
    try {
      await this.notificationsService.addDocumentParticipants(
        document.participants,
      );
      this.server.in(document.participants).emit('notify created document');
    } catch (error) {
      console.log(error.message, 'NOTIFY CREATE DOCUMENT');
    }
  }

  @SubscribeMessage('load data')
  handleChangeActivity() {
    this.server.emit('loaded data');
  }

  @SubscribeMessage('logout')
  handlelogout(@ConnectedSocket() client: Socket) {
    client.disconnect();
  }
}
