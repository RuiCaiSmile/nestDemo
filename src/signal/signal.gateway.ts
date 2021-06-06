import { Server } from 'ws';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  askChat,
  acceptChat,
  setClients,
  handleSignal,
  wbSignal,
  updateClients,
  deleteRelatedSource,
} from './signal.info';
import { deleteUserLogout, setUserLogin } from '../login/login.info';
import { msgRep } from '../common/common.utils';

@WebSocketGateway(9001)
export class SignalGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private token;

  private username;

  private targetUser: {
    username: string;
    acceptConnection: boolean | '';
  };

  private client;

  // 链接成功
  handleConnection(client: any) {
    console.log('进入连接');
    this.client = client;
    if (this.token) {
      updateClients(this.token, this.client);
    }
  }

  // 链接断开
  handleDisconnect(client: any) {
    console.log('断开连接');
    if (this.token) {
      deleteUserLogout(this.token);
      deleteRelatedSource(this.token, this.username);
      this.token = null;
      this.username = null;
    }
  }

  // TODO 主动触发close，会进入onclose吗

  // 登录
  @SubscribeMessage(wbSignal.login)
  handleLoginEvent(@MessageBody() data: { token: string; username: string }) {
    if (data.token && data.username) {
      this.token = data.token;
      this.username = data.username;
      const res = setUserLogin(this.username, this.token);
      setClients(this.token, this.client);
      return msgRep(wbSignal['login-rsp'], 'login success', true);
    } else {
      return msgRep(wbSignal['login-rsp'], 'no data', false);
    }
  }

  // 聊天请求
  @SubscribeMessage(wbSignal['CTC-chat-req'])
  async handleChatReqEvent(
    @MessageBody() data: { target: string },
    @ConnectedSocket() client,
  ) {
    if (data.target) {
      this.targetUser = {
        username: data.target,
        acceptConnection: '',
      };
      const res = await askChat(data.target, this.token, this.username);
      console.log('askChat', res);
      if (res) {
        // client.send(
        //   JSON.stringify(msgRep(wbSignal['CTC-chat-rsp'], '对端已接受', true)),
        // );
        //
        return msgRep(wbSignal['CTC-chat-rsp'], '对端已接受', true);
      } else {
        client.send(msgRep(wbSignal['CTC-chat-rsp'], '对端已拒绝', false));
      }
    } else {
      client.send(msgRep(wbSignal['CTC-chat-rsp'], 'no data', false));
    }
  }

  //聊天邀请（对端）回复
  @SubscribeMessage(wbSignal['CTC-chat-invitation'])
  async handleChatResEvent(
    @MessageBody() data: { target: string; accept: boolean },
  ) {
    return acceptChat(data.target, this.token, data.accept);
  }

  // candidate交互
  @SubscribeMessage(wbSignal['CTC-candidate'])
  async handleCandidateEvent(@MessageBody() data: any) {
    if (data) {
      handleSignal(data, this.token, this.targetUser, 'candidate');
    }
  }

  // offer交互
  @SubscribeMessage(wbSignal['CTC-offer'])
  async handleOfferEvent(@MessageBody() data: any) {
    if (data) {
      handleSignal(data, this.token, this.targetUser, 'offer');
    }
  }

  // @SubscribeMessage('CTC-exchanged')
  // async handleExchangedEvent() {
  //
  // }
}
