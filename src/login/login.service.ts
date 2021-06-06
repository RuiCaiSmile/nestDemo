import { Injectable } from '@nestjs/common';
import { loginData } from '../common/common.interface';
import { setUserLogin } from './login.info';

@Injectable()
export class LoginService {
  public checkUser(data: loginData) {
    // return setUserLogin(data.name);
  }
}
