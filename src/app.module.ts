// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';

// API MODULES
import { UsersModule } from './api/users/users.module';
import { AreasModule } from './api/areas/areas.module';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { FlujosModule } from './api/flujos/flujos.module';
import { DocumentsModule } from './api/documents/documents.module';
import { ActivitiesModule } from './api/activities/activities.module';
import { CommentsModule } from './api/comments/comments.module';
import { FilesModule } from './api/files/files.module';
import { HistoryModule } from './api/history/history.module';
import { DevolucionesModule } from './api/devoluciones/devoluciones.module';
import { ReportsModule } from './api/reports/reports.module';

// Gateways
import { KanbaGateway } from './gateways';
import { NotificationsModule } from './gateways/notifications/notifications.module';
import { ChatsModule } from './api/chats/chats.module';
import { ChatGateway } from './gateways/chat.gateway';
import { MessagesModule } from './api/messages/messages.module';

let CLUSTER =
  // 'mongodb+srv://bloodysi:bloodysi@atlascluster.fohieyx.mongodb.net/?retryWrites=true&w=majority';
  'mongodb://localhost:27017/alertdocs';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || CLUSTER),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'buenoct2001@gmail.com',
          pass: 'zpadokkbknofcwbb',
        },
      },
    }),
    UsersModule,
    AreasModule,
    AuthModule,
    FlujosModule,
    DocumentsModule,
    ActivitiesModule,
    CommentsModule,
    FilesModule,
    HistoryModule,
    DevolucionesModule,
    ReportsModule,
    NotificationsModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, KanbaGateway, ChatGateway],
})
export class AppModule {}
