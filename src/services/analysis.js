import { request, config, mockajax } from 'utils'
const { api } = config
const { analysis } = api

export async function query (params) {
  return mockajax(analysis,{
    method: 'get'
  })
}
