import { FetchGet,FetchPost,FetchDelete } from 'utils/fetch'

export default {
  namespace: 'menu',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    entity:{},
    tree:[],
    modalVisible: false,
    defaultSerialNum:1,
    parentId:-1
  },
  reducers: {
    fetchEnd(state, {payload}) {
      console.log('fetchEnd',payload);
      return {
        ...state,
        ...payload,
      }
    }
  },
  effects: {
    * fetch ({payload}, { put, call, select }){
      yield put({
        type: 'fetchEnd',
        payload: {
          ...payload
        }
      });
    },
    * loadTree ({payload}, { put, call, select }) {
      const menuData = yield call(FetchGet,'/api/menus');
      yield put({
        type: 'fetchEnd',
        payload: {
          tree: menuData.result
        }
      });
    },
    * addOne ({payload}, { put, call, select }) {
      const menu = yield select(_ => _.menu);
      const data = yield call(FetchPost, `/api/menus`,{parentId:menu.parentId,...payload});
      yield put({
        type: 'fetchEnd',
        payload: {
          data: {
            list: menu.data.list.concat(data.result),
            pagination: menu.data.pagination
          }
        }
      });
    },
    * loadOne ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/menus/${payload.id}`);
      payload.callback && payload.callback(data.result);
      yield put({
        type: 'fetchEnd',
        payload: {
          modalVisible: true
        }
      });
    },
    * deleteOne ({payload}, { put, call, select }) {
      const menu = yield select(_ => _.menu);
      yield call(FetchDelete, `/api/menus/${payload.id}`);
      yield put({
        type: 'fetchEnd',
        payload: {
          data: {
            list: [].concat(menu.data.list.filter( item => payload.id != item.id )),
            pagination: menu.data.pagination
          }
        }
      });
    },
    * loadChild ({payload}, { put, call, select }) {
      const data = yield call(FetchGet, `/api/menus/childs/${payload.id}`,payload);
      yield put({
        type: 'fetchEnd',
        payload: {
          data: data.result,
          parentId:payload.id,
          defaultSerialNum: data.result.list.length+1
        }
      });
    }
  }
}
