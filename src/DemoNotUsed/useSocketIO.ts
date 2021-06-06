// import { Socket, Server } from 'socket.io';
// import {
//   OnGatewayInit,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import ws from 'ws';
//
// @WebSocketGateway(9001)
// export class SignalGateway implements OnGatewayDisconnect, OnGatewayConnection {
//   @WebSocketServer()
//   server: Server;
//
//   // 建立链接事件
//   // TODO socket与io不是一个东西？。。。
//   // TODO 还是转换为ws吧？
//   handleConnection(client: any) {
//     console.log('进入链接');
//
//     client.emit('events', 'hello');
//   }
//
//   // 断开连接事件
//   handleDisconnect(client: any) {
//     console.log(
//       '客户端(' + client.handshake.address + ')已与服务器断开socket.io链接...',
//     );
//   }
//
//   //接收客户端的数据
//   @SubscribeMessage('events')
//   handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
//     client.emit('events', { name: 'Nest' }, (data) => console.log(data));
//     // TODO 不生效，为什么？
//     // return data
//   }
// }
