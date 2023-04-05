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

@WebSocketGateway(1082, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer() server: Server;

  afterInit(server: any) {
    console.log('Inicio chat socket');
  }

  handleConnection(client: any, ...args: any[]) {
    // console.log('User connected to CHAT socket');
  }

  handleDisconnect(client: any) {
    // console.log('ALguien se fue de CHAT socket! chao chao');
  }

  @SubscribeMessage('setup')
  handleSetup(@ConnectedSocket() client: Socket, @MessageBody() user: string) {
    console.log('CHAT USER CONNECTED: ', user);
    client.join(user);
  }

  @SubscribeMessage('join chat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    console.log('JOIN: ', room);
    client.join(room);
  }

  @SubscribeMessage('leave chat')
  handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() document: any,
  ) {
    if (client.rooms.size > 2) {
      client.leave(Array.from(client.rooms.values())[client.rooms.size - 1]);
    }
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.in(room).emit('typing', room);
  }

  @SubscribeMessage('stop typing')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    this.server.in(room).emit('stop typing');
  }

  @SubscribeMessage('new message')
  handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
  ) {
    let chat = message.chat;

    if (!chat.users) console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      client.in(user._id).emit('message recieved', message);
    });
  }
}
