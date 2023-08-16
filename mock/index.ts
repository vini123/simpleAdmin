import type { MockMethod } from 'vite-plugin-mock';

import menus from './menu'

export default [
  {
    url: '/api/login',
    method: 'post',
    response: (options: Mock.MockOption): Mock.MockServiceResult<any> => {
      const { username = undefined, password = undefined } = options.body;

      if (!username || !password) {
        return {
          code: 1000,
          message: '参数错误',
          data: null
        };
      }

      // if (username !== '13671638524') {
      //   return {
      //     code: 1000,
      //     message: '请输入正确的手机号码',
      //     data: null
      //   };
      // }

      return {
        code: 200,
        message: 'ok',
        data: {
          token: 'abcdefg',
          refreshToken: '20000'
        }
      };
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        nickname: '七月羽歌',
        gender: 1,
        avatar: 'https://www.yuepaibao.com/storage/upload/image/avatar/202106/1.jpg?time=1691482955',
        menus: menus
      };
    },
  },
  {
    url: '/api/logout',
    method: 'post',
    response: () => {
      return {
        message: 'success'
      }
    },
  }
] as MockMethod[];