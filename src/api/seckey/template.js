import request from '@/utils/request'
export function add(data) {
  return request({
    url: 'api/template',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/template',
    method: 'delete',
    data: ids
  })
}


export default { add, del }
