import request from '@/utils/request'

export function uploadImage(params) {
    return request({
        url: '/images',
        method: 'post',
        data: params
    })
}
  