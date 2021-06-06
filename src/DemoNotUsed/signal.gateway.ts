// import { Server } from 'ws';
// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
//
// @WebSocketGateway(9001)
// export class SignalGateway implements OnGatewayDisconnect, OnGatewayConnection {
//   @WebSocketServer()
//   server: Server;
//
//   handleConnection(client: any) {
//     console.log('进入链接');
//   }
//
//   handleDisconnect(client: any) {
//     console.log('断开链接');
//   }
//
//   //接收客户端的数据
//   @SubscribeMessage('events')
//   handleEvent(@MessageBody() data: string) {
//     console.log(data);
//     // client.emit('events', { name: 'Nest' }, (data) => console.log(data));
//     // TODO 使用ws是生效的，使用socket.io是不生效的
//     return 'this is events';
//   }
//
//   //接收客户端的数据
//   @SubscribeMessage('cl')
//   handleOpenEvent(@MessageBody() data: string) {
//     console.log(data);
//     // client.emit('events', { name: 'Nest' }, (data) => console.log(data));
//     // TODO 使用ws是生效的，使用socket.io是不生效的
//     return 'this is cl';
//   }
// }
