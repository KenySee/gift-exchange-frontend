import { FetchGet,FetchPost,FetchPatch,FetchDelete } from 'utils/fetch'
import { message } from 'antd'
export default {
  namespace: 'user',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    tree:[],
    editing:false,
    modalVisible: false,
    depotId:-1
  },
  reducers: {
    fetchEnd(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    * loadTree ({payload}, { put, call, select }) {
      const dptData = yield call(FetchGet,'/api/depots');
      if(dptData.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            tree: dptData.result
          }
        });
      }
    },
    * addOne ({payload}, { put, call, select }) {
      const user = yield select(_ => _.user);
      const data = yield call(FetchPost, `/api/users`,{depotId:user.depotId,...payload});
      if(data.success){
        message.success(`${user.editing ? '更新' : '添加'}成功`);
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: user.data.list.concat(data.result),
              pagination: user.data.pagination
            }
          }
        });
      }

    },
    * updateOne ({payload}, { put, call, select }) {
      const user = yield select(_ => _.user);
      const data = yield call(FetchPatch, `/api/users`,payload);
      if(data.success) {
        message.success(`${user.editing ? '更新' : '添加'}成功`);
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: [].concat(user.data.list.map(item => {
                if (item.id == payload.id) {
                  return data.result
                }
                return item;
              })),
              pagination: user.data.pagination
            }
          }
        })
      }
    },
    * loadOne ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/users/${payload.id}`);
      console.log('loadOne',data);
      if(data.success) {
        payload.callback && payload.callback(data.result);
      }
    },
    * deleteOne ({payload}, { put, call, select }) {
      const user = yield select(_ => _.user);
      const data = yield call(FetchDelete, `/api/users/${payload.id}`);
      if(data.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: [].concat(user.data.list.filter(item => payload.id != item.id)),
              pagination: user.data.pagination
            }
          }
        })
      }
    },
    * loadChild ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/users/lists/${payload.id}`,payload);
      if(data.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            data: data.result,
            depotId: payload.id
          }
        })
      }
    }
  }
}
