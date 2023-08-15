import request from '@/utils/request'

export function csrfCookie() {
    return request({
      url: '/sanctum/csrf-cookie',
      method: 'get'
    })
  }
  
export function login(data:LoginData) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}
  
export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get',
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}