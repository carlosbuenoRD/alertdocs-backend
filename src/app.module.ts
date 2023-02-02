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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/alertdocs'),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
