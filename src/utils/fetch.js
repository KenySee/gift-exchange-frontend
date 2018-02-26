import { request } from 'utils'
import { stringify } from 'qs';
export async function FetchGet(url,params) {
  return request({
    url: params ? `${url}?${stringify(params)}` : url,
    method: 'get'
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
