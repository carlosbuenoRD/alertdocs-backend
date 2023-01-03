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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/alertdocs'),
    UsersModule,
    AreasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
