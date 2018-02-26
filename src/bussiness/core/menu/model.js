import { FetchGet,FetchPost,FetchPatch,FetchDelete } from 'utils/fetch'

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
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    * loadTree ({payload}, { put, call, select }) {
      const menuData = yield call(FetchGet,'/api/menus');
      const listData = menuData.result.filter(item => item.parentId==-1);
      yield put({
        type: 'fetchEnd',
        payload: {
          tree: menuData.result,
          data:{
            list: [].concat(listData),
            pagination:{current:1,pageSize:10,total:listData.length}
          }
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
          },
          tree: menu.tree.concat(data.result)
        }
      });
    },
    * updateOne ({payload}, { put, call, select }) {
      const menu = yield select(_ => _.menu);
      const data = yield call(FetchPatch, `/api/menus`,payload);
      yield put({
        type: 'fetchEnd',
        payload: {
          data: {
            list: [].concat(menu.data.list.map(item => {
              if(item.id == payload.id){
                return data.result
              }
              return item;
            })),
            pagination: menu.data.pagination
          },
          tree: [].concat(menu.tree.map(item => {
            if(item.id == payload.id){
              return data.result
            }
            return item;
          }))
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
          },
          tree: [].concat(menu.tree.filter( item => payload.id != item.id ))
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
