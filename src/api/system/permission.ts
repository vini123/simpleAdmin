import request from '@/utils/request'

export function getPermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'get',
        params: data
    })
}

export function createPermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'post',
        data: data
    })
}

export function updatePermissionsOrders(data:any) {
    return request({
        url: '/permissions/orders',
        method: 'put',
        data: data
    })
}
