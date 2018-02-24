import { request } from 'utils'
export async function FetchGet(url,params) {
  return request({
    url: url,
    method: 'get',
    data: params,
  })
}
export async function FetchPost(url,params) {
  return request({
    url: url,
    method: 'post',
    data: params,
  })
}
export async function FetchDelete(url,params) {
  return request({
    url: url,
    method: 'delete',
    data: params,
  })
}
export async function FetchPatch(url,params) {
  return request({
    url: url,
    method: 'patch',
    data: params,
  })
}
