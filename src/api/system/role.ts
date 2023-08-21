import request from '@/utils/request'

export function getRoles(data:any) {
    return request({
        url: '/roles',
        method: 'get',
        params: data
    })
}

export function getRole(id:number) {
    return request({
        url: `/roles/${id}`,
        method: 'get'
    })
}

export function createOrUpdateRoles(data:any) {
    return request({
        url: '/roles',
        method: 'post',
        data: data
    })
}

export function deleteRoles(data:any) {
    return request({
        url: '/roles',
        method: 'delete',
        data: data
    })
}

export function getRolePermissions(data:any) {
    return request({
        url: '/roles/permissions',
        method: 'get',
        params: data
    })
}

export function setRolePermissions(data:any) {
    return request({
        url: '/roles/permissions',
        method: 'put',
        data: data
    })
}