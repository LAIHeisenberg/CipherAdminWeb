import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bsGroup',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/bsGroup/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/bsGroup',
    method: 'put',
    data
  })
}

export function getAllGroup() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/bsGroup',
    method: 'get',
    params
  })
}

export default { add, edit, del }
