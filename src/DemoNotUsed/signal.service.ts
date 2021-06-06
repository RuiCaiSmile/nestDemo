import { Injectable } from '@nestjs/common';
import { signalData, resData } from './signal.interface';

@Injectable()
export class SignalService {
  public async create(data: signalData): Promise<resData> {
    if (data.type) {
      return Promise.resolve({
        code: 200,
        des: 'add success',
        result: 'success',
      });
    }
    return Promise.reject({
      code: 500,
      des: 'Need signal type!',
      result: 'success',
    });
  }

  public async get(id?: string): Promise<resData> {
    if (id) {
      return Promise.resolve({
        code: 200,
        des: `查询了${id}的信令数据`,
        result: 'success',
      });
    }
    return Promise.resolve({
      code: 500,
      des: '查询了所有的信令数据',
      result: 'success',
    });
  }
}
