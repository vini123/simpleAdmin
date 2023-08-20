import request from '@/utils/request'

export function getPermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'get',
        params: data
    })
}

export function getPermission(id:number) {
    return request({
        url: `/permissions/${id}`,
        method: 'get'
    })
}

export function createPermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'post',
        data: data
    })
}

export function deletePermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'delete',
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
