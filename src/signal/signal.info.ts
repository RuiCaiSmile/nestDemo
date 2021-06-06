import { action } from '../common/common.interface';
import {
  makeTaskID,
  msgRep,
  getSameKeyValue,
  getSameKeyIndex,
  removeSameKey,
  removeSameKeyArray,
  setNewArray,
} from '../common/common.utils';
import { getUser } from '../login/login.info';

// TODO Import 引入方式会添加default报undefined错
const _ = require('lodash');

enum signStatus {
  'offer',
  'candidate',
  'success',
  'idle',
}

export enum wbSignal {
  'login' = 'login',
  'login-rsp' = 'login-rsp',
  'CTC-chat-req' = 'CTC-chat-req',
  'CTC-chat-rsp' = 'CTC-chat-rsp',
  'CTC-chat-invitation' = 'CTC-chat-invitation',
  'CTC-chat-notification' = 'CTC-chat-notification',
  'CTC-offer' = 'CTC-offer',
  'CTC-candidate' = 'CTC-candidate',
  'CTC-RTC-error' = 'CTC-RTC-error',
}

enum chatStatus {
  'accept',
  'refuse',
  'suspend',
  'idle',
}

enum webRTCSignal {
  candidate = 'candidate',
  offer = 'offer',
}

interface chatExchanged {
  sponsor: string;
  recipient: string;
  status: chatStatus;
  resolve?: any;
}

export interface signal {
  token: string;
  type: string;
  status: signStatus;
}

// TODO 验证多个candidate的使用上有什么不同
// TODO firefox会发送空candidate，确认原因以及是否需要删除

// 服务列表  可以用订阅，但考虑其他代码压力，暂时就用示例数组
const clients = [];
// 聊天标识池
const chatPool: chatExchanged[] = [];
// 信令标识池
const signalPool: signal[] = [];

// 根据名称获取token
const getUserToken = (target) => {
  const users = getUser();
  const hasTarget = getSameKeyIndex(users, { username: target }, 'username');
  return hasTarget === -1 ? false : users[hasTarget].token;
};

// 设置服务器
export const setClients = (token, client) => {
  clients.push({
    token,
    client,
  });
};

// 重新保存服务器
export const updateClients = (token, client) => {
  const index = getSameKeyIndex(clients, { token }, 'token');
  if (index !== -1) {
    clients[index].client = client;
  }
};

// 获取服务器
export const getClient = (token) => {
  const data = getSameKeyValue(clients, { token }, 'token');
  return data ? data.client : false;
};

// 通知对端
export const notifyChat = (token, username) => {
  const client = getClient(token);
  console.log(client);
  if (client) {
    client.send(
      JSON.stringify(msgRep(wbSignal['CTC-chat-invitation'], username)),
    );
  }
};

// 同意对端
export const acceptChat = (target, token, accept) => {
  console.log('进入 acceptChat');
  const targetToken = getUserToken(target);
  if (targetToken) {
    const sponsorIndex = getSameKeyIndex(
      chatPool,
      { recipient: targetToken },
      'recipient',
    );
    const sponsor = chatPool[sponsorIndex];
    if (sponsor.sponsor === token && accept) {
      sponsor.resolve(true);
      sponsor.status = chatStatus.accept;
      const reqSign = {
        token,
        type: 'CTC',
        status: signStatus.idle,
      };
      const resSign = {
        token: targetToken,
        type: 'CTC',
        status: signStatus.idle,
      };
      signalPool.push(reqSign);
      signalPool.push(resSign);
      return msgRep(wbSignal['CTC-chat-rsp'], '对端已经接受', true);
    } else if (accept) {
      sponsor.resolve(false);
      return msgRep(wbSignal['CTC-chat-rsp'], '对端校验失败', false);
    } else {
      sponsor.resolve(false);
      return msgRep(wbSignal['CTC-chat-rsp'], '已拒绝对端', true);
    }
  } else {
    return msgRep(wbSignal['CTC-chat-rsp'], `对端已经关闭`, false);
  }
};

// 请求对端
export const askChat = (target, token, username) => {
  // 请求者
  const hasAdd = getSameKeyIndex(chatPool, { sponsor: token }, 'sponsor');
  // 接收者
  const targetToken = getUserToken(target);
  console.log(`${username}请求${target}聊天`);
  console.log(targetToken);
  return new Promise((resolve) => {
    if (!targetToken) {
      resolve(false);
      return;
    }
    if (hasAdd !== -1) {
      const item = chatPool[hasAdd];
      const canAsk =
        item.status !== chatStatus.accept && item.status !== chatStatus.suspend;
      if (canAsk) {
        chatPool[hasAdd] = {
          status: chatStatus.suspend,
          sponsor: token,
          recipient: targetToken,
          resolve,
        };
        notifyChat(targetToken, username);
      } else {
        resolve(false);
      }
    } else {
      chatPool.push({
        status: chatStatus.suspend,
        sponsor: token,
        recipient: targetToken,
        resolve,
      });
      notifyChat(targetToken, username);
    }
  });
};

// 删除信令标识
export const removeSignal = (token) => {
  const res = removeSameKey(signalPool, { token }, 'token');
  setNewArray(signalPool, res);
};

// 处理交流信令
export const handleSignal = (data, token, target, type) => {
  const targetToken = getUserToken(target.username);
  const client = getClient(targetToken);
  const canSendSignal = _.findIndex(signalPool, (item) => {
    return item.token === token;
  });
  const signal = `CTC-${type}`;
  if (canSendSignal !== -1 && client) {
    const signalData = {
      data: data,
      event: signal,
    };
    client.send(JSON.stringify(signalData));
  }
};

// 删除相关资源
export const deleteRelatedSource = (token, username) => {
  const newClients = removeSameKeyArray(clients, [{ token }], 'token');
  setNewArray(clients, newClients);
  const newChat = removeSameKeyArray(chatPool, [{ sponsor: token }], 'sponsor');
  setNewArray(chatPool, newChat);
  const newChatPool = removeSameKeyArray(
    chatPool,
    [{ recipient: token }],
    'recipient',
  );
  setNewArray(chatPool, newChatPool);
  const newSignalPool = removeSameKeyArray(signalPool, [{ token }], 'token');
  setNewArray(signalPool, newSignalPool);
  console.log('执行了清空操作', token, clients, chatPool, signalPool);
};
