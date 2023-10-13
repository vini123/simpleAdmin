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

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

// 小程序码登录
export function getLoginQrcode(data:any) {
    return request({
        url: '/login-qrcode',
        method: 'post',
        data
    })
}

// 轮询获取 token
export function getLoginToken(data:any) {
    return request({
        url: '/login-token',
        method: 'get',
        params: data
    })
}

export function setUserRole(data:any) {
    return request({
        url: '/user/roles',
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

export function getUserProfile() {
    return request({
        url: '/user/profile',
        method: 'get',
    })
}

export function setUserProfile(data:any) {
    return request({
        url: '/user/profile',
        method: 'put',
        data
    })
}

export function setUserPassword(data:any) {
    return request({
        url: '/user/passwords',
        method: 'put',
        data
    })
}

export function setUserLock(data:any) {
    return request({
        url: '/user/lock',
        method: 'put',
        data
    })
}

export function checkUserLock(data:any) {
    return request({
        url: '/user/lock',
        method: 'post',
        data
    })
}