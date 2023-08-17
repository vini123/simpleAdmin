import request from '@/utils/request'

export function getPermissions(data:any) {
    return request({
        url: '/permissions',
        method: 'get',
        params: data
    })
}
