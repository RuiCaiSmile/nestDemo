import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getCats(): string {
    return 'This is a Chinese pastoral cat.';
  }
}
