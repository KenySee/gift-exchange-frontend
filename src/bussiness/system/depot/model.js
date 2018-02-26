import { FetchGet,FetchPost,FetchPatch,FetchDelete } from 'utils/fetch'
import { message } from 'antd'

export default {
  namespace: 'depot',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    tree:[],
    editing:false,
    modalVisible: false,
    defaultSerialNum:1,
    parentId:-1
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
      const listData = dptData.result.filter(item => item.parentId==-1);
      if(dptData.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            tree: dptData.result,
            data: {
              list: [].concat(listData),
              pagination: {current: 1, pageSize: 10, total: listData.length}
            }
          }
        })
      }
    },
    * addOne ({payload}, { put, call, select }) {
      const dept = yield select(_ => _.depot);
      const data = yield call(FetchPost, `/api/depots`,{parentId:dept.parentId,...payload});
      if(data.success) {
        message.success(`${dept.editing ? '更新' : '添加'}成功`);
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: dept.data.list.concat(data.result),
              pagination: dept.data.pagination
            },
            tree: dept.tree.concat(data.result)
          }
        })
      }
    },
    * updateOne ({payload}, { put, call, select }) {
      const dept = yield select(_ => _.depot);
      const data = yield call(FetchPatch, `/api/depots`,payload);
      if(data.success) {
        message.success(`${dept.editing ? '更新' : '添加'}成功`);
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: [].concat(dept.data.list.map(item => {
                if (item.id == payload.id) {
                  return data.result
                }
                return item;
              })),
              pagination: dept.data.pagination
            },
            tree: [].concat(dept.tree.map(item => {
              if (item.id == payload.id) {
                return data.result
              }
              return item;
            }))
          }
        })
      }
    },
    * loadOne ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/depots/${payload.id}`);
      if(data.success) {
        payload.callback && payload.callback(data.result);
      }
    },
    * deleteOne ({payload}, { put, call, select }) {
      const dept = yield select(_ => _.depot);
      const data = yield call(FetchDelete, `/api/depots/${payload.id}`);
      if(data.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            data: {
              list: [].concat(dept.data.list.filter(item => payload.id != item.id)),
              pagination: dept.data.pagination
            },
            tree: [].concat(dept.tree.filter(item => payload.id != item.id))
          }
        })
      }
    },
    * loadChild ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/depots/childs/${payload.id}`,payload);
      if(data.success) {
        yield put({
          type: 'fetchEnd',
          payload: {
            data: data.result,
            parentId: payload.id,
            defaultSerialNum: data.result.list.length + 1
          }
        })
      }
    }
  }
}
