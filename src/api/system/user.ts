import request from '@/utils/request'

export function getUsers(data:any) {
    return request({
        url: '/users',
        method: 'get',
        params: data
    })
}
