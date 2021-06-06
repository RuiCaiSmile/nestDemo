import {
  getSameKeyIndex,
  makeToken,
  removeSameKeyArray,
  setNewArray,
} from '../common/common.utils';

const _ = require('lodash');

const users = [];

export const setUserLogin = (username, token) => {
  const isLogin = getSameKeyIndex(users, { username: username }, 'username');
  if (isLogin === -1) {
    users.push({
      username,
      token,
    });
    console.log(users);
  }
  return _.cloneDeep(users);
};

// TODO websocket的check应该在adapter里写？
// TODO http的check可以在守卫里写，之后尝试
// export const checkToken = (token) => {
//   const isLogin = _.findIndex(users, (item) => {
//     return item.token === token;
//   });
//   return isLogin === -1 ? false : true;
// };

export const deleteUserLogout = (token) => {
  const res = removeSameKeyArray(users, [{ token }], 'token');
  setNewArray(users, res);
};

export const getUser = () => {
  return _.cloneDeep(users);
};
