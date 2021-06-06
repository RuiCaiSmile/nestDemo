import { Controller, Get, Post, Query, Body, Param } from '@nestjs/common';
import { LoginService } from './login.service';
import { loginData, resData } from '../common/common.interface';
import { ErrRes, SuRes } from '../common/common.utils';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async createSignalData(@Body() data: loginData): Promise<resData> {
    const res = this.loginService.checkUser(data);
    // if (res) {
    //   return SuRes('login success', res);
    // }
    return ErrRes('login failed');
  }
}
