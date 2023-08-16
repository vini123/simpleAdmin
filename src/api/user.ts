import request from '@/utils/request'

export function getCaptcha(){
    return request({
        url: '/captchas',
        method: 'post'
    })
}

export function login(data:any) {
    return request({
        url: '/login',
        method: 'post',
        data
    })
}

export function register(data:any) {
    return request({
        url: '/register',
        method: 'post',
        data
    })
}

export function setUserRole(data:any) {
    return request({
        url: '/roles',
        method: 'put',
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