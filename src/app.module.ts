import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SignalModule } from './signal/signal.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [SignalModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
