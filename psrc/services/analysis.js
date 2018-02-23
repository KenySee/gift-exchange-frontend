import { request, config } from 'utils'

const { api } = config
const { analysis } = api

export async function query (params) {
  return request({
    url: analysis,
    method: 'get',
    data: params,
  })
}
