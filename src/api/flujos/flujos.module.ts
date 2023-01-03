import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Models
import { Flujo, FlujoSchema } from '@/schemas/flujos.schema';
import { User, UserSchema } from '@/schemas/users.schema';

// CONTROLLER
import { FlujosService } from './flujos.service';
import { FlujosController } from './flujos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flujo.name, schema: FlujoSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FlujosController],
  providers: [FlujosService],
})
export class FlujosModule {}
