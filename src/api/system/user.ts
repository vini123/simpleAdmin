import request from '@/utils/request'

export function getUsers(data:any) {
    return request({
        url: '/users',
        method: 'get',
        params: data
    })
}

export function getUserRoles(data:any) {
    return request({
        url: '/users/roles',
        method: 'get',
        params: data
    })
}

export function setUserRoles(data:any) {
    return request({
        url: '/users/roles',
        method: 'put',
        data
    })
}