import { Module } from "@nestjs/common";
import { SignalService } from "./signal.service";
import { SignalControl } from "./signal.control";


@Module({
  providers: [SignalService],
  controllers: [SignalControl]
})
export class SignalModule {
}
