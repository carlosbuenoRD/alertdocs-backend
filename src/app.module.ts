// Modules
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/alertdocs'),
    UsersModule,
    AreasModule,
    AuthModule,
    FlujosModule,
    DocumentsModule,
    ActivitiesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
