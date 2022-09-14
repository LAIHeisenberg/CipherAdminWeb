import request from '@/utils/request'

export function getSysRootKey() {
    return request({
      url: 'api/sysRootSecretkey',
      method: 'get'
    })
}

export function getSysRootCert() {
    return request({
      url: 'api/sysRootCertificate',
      method: 'get'
    })
}

export function getWorkKey() {
    return request({
      url: 'api/sysWorkSecretkey',
      method: 'get'
    })
}

export function createWorkKey() {
    return request({
      url: 'api/sysWorkSecretkey',
      method: 'post'
    })
}

export default { getSysRootKey, getSysRootCert, getWorkKey, createWorkKey }