import request from '@/utils/request'

export function uploadImage(params:any) {
    return request({
        url: '/images',
        method: 'post',
        data: params
    })
}
  