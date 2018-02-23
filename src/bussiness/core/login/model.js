import { routerRedux } from 'dva/router'
import { FetchPost } from 'utils/fetch'

export default {
  namespace: 'login',
  state: {},
  effects: {
    * login ({payload}, { put, call, select }) {
      const data = yield call(FetchPost,'/auth', payload)
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/updateToken', payload: data.result.token })
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    },
  },

}
