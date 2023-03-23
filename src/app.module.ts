// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { KanbaGateway, NotifyGateway } from './gateways';

let CLUSTER =
  'mongodb+srv://bloodysi:bloodysi@atlascluster.fohieyx.mongodb.net/?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(CLUSTER),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
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
  ],
  controllers: [AppController],
  providers: [AppService, KanbaGateway, NotifyGateway],
})
export class AppModule {}
