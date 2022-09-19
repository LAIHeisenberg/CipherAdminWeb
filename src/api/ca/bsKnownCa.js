import request from '@/utils/request'
export function add(data) {
  return request({
    url: '/api/bsKnownCa',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/bsKnownCa',
    method: 'delete',
    data: ids
  })
}

export default { add, del }
