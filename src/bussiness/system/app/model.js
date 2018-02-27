import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { FetchGet,FetchPost } from 'utils/fetch'
import queryString from 'query-string'
import axios from 'axios'
import { mockAjax } from 'utils'
const { prefix,baseURL } = config

export default {
  namespace: 'app',
  state: {
    user: {menuList:[]},
    menu: [],
    notices:[],
    collapsed:false,
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    token: window.localStorage.getItem(`${prefix}token`),
    locationPathname: '',
    locationQuery: {},
  },
  reducers: {
    fetchEnd(state, { payload }) {
      return { ...state, ...payload};
    },
    updateToken (state, { payload }) {
      window.localStorage.setItem(`${prefix}token`, payload)
      return {
        ...state,
        token: payload,
      }
    },
    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    switchTheme (state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },
    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
    handleNotifyChange (state, { payload }) {
      return {
        ...state,
        notices: payload,
        user: {
          ...state.user,
          notifyCount: payload.length,
        },
      };
    }
  },
  effects: {
    * query ({payload}, { call, put, select }) {
      const { locationPathname,token } = yield select(_ => _.app);
      axios.defaults.baseURL = baseURL;
      const userData = yield call(FetchPost,'/isTokenExpired', {token:token});
      if (userData.success) {
        axios.defaults.headers.common['token'] = `Bearer ${token}`;
        const menuData = yield call(FetchGet,'/api/menus');
        if(menuData.success){
          yield put({
            type: 'fetchEnd',
            payload: {
              user:userData.result,
              menu:menuData.result
            }
          })
        }
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/',
          }))
        }
      }
      else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },
    * logout ({payload}, { call, put }) {
      yield put({ type: 'updateToken', payload: null })
      yield put({ type: 'query' })
    },
    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
    * fetchNotices ({payload}, { call, put }) {
      const data = yield call(mockAjax,`/notices`, {method: 'get'});
      yield put({
        type: 'handleNotifyChange',
        payload: data
      })
    }
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'fetchEnd',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },
    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    }
  }
}
