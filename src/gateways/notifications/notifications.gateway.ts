import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Server, Socket } from 'socket.io';
import { EmailService } from './email.service';

import { NotificationsService } from './notifications.service';

import {
  NotificationSetting,
  NotificationSettingDocument,
} from '@/schemas/notificationSettings.schema';
export const notificationSettings = [
  {
    name: 'general',
    options: [
      {
        name: 'Documento creado',
        message: 'Has sido agregado a un documento mantente alerta a tu turno.',
        keep: false,
        email: false,
      },
      {
        name: 'Es tu turno',
        message:
          'Tu tarea esta lista para empezar, terminala lo mas rapido posible!',
        keep: false,
        email: false,
      },
      {
        name: 'Eres el siguiente',
        message:
          'Tu tarea es las siguiente mantente alerta, terminala lo mas rapido posible!',
        keep: false,
        email: false,
      },
    ],
  },
  {
    name: 'devoluciones',
    options: [
      {
        name: 'Recibida',
        message:
          'Has recibido una devolucion, terminala lo mas rapido posible!',
        keep: false,
        email: false,
      },
      {
        name: 'Entregada',
        message: 'Tu devolucion fue regresada, continua con tu actividad!',
        keep: false,
        email: false,
      },
    ],
  },
  {
    name: 'alertas',
    options: [
      {
        name: 'Documento retrasado',
        message: 'Un documento esta retrasado, verifica que todo este bien  ',
        keep: false,
        email: false,
      },
    ],
  },
];

@WebSocketGateway(+process.env.NOTIFICATION_PORT || 1081, {
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly mailerService: EmailService,
    @InjectModel(NotificationSetting.name)
    private notificationSetting: Model<NotificationSettingDocument>,
  ) {}

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
  async handleUpcomingActivity(
    @ConnectedSocket() client: Socket,
    @MessageBody() user: string,
  ) {
    let setting = await this.notificationSetting.findOne({ name: 'general' });
    if (setting.options[2].email) {
      this.mailerService.sendMail(setting.options[2].message);
    }
    client.in(user).emit('upcoming activity', setting.options[2]);
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
    let setting = await this.notificationSetting.findOne({ name: 'general' });
    if (setting.options[1].email) {
      this.mailerService.sendMail(setting.options[1].message);
    }
    client.in(user).emit('ready activity', setting.options[1]);
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
    let setting = await this.notificationSetting.findOne({
      name: 'devoluciones',
    });
    if (setting.options[0].email) {
      this.mailerService.sendMail(setting.options[0].message);
    }
    client.in(user).emit('devolucion created', setting.options[0]);
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
    let setting = await this.notificationSetting.findOne({
      name: 'devoluciones',
    });
    if (setting.options[1].email) {
      this.mailerService.sendMail(setting.options[1].message);
    }
    client.in(user).emit('devolucion ended', setting.options[1]);
  }

  @SubscribeMessage('create document')
  async handleCreateDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() document,
  ) {
    try {
      let setting = await this.notificationSetting.findOne({ name: 'general' });
      if (setting.options[0].email) {
        this.mailerService.sendMail(setting.options[0].message);
      }
      this.server.emit('created document');
      await this.notificationsService.addDocumentParticipants(
        document.participants,
      );
      this.server
        .in(document.participants)
        .emit('notify created document', setting.options[0]);
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
