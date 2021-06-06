import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { SignalService } from './signal.service';
import { signalData, resData } from './signal.interface';

@Controller('signal')
export class SignalControl {
  constructor(private readonly signalService: SignalService) {}

  @Get(':id')
  async getSignalDataByID(@Param('id') id): Promise<resData> {
    return await this.signalService.get(id);
  }

  @Get()
  async getSignalData(@Query('id') id): Promise<resData> {
    return await this.signalService.get(id);
  }

  // 默认解析的是x-www-form-urlencoded，传其他的有问题
  @Post()
  async createSignalData(@Body() data: signalData): Promise<resData> {
    console.log(data);
    return await this.signalService.create(data);
  }
}
