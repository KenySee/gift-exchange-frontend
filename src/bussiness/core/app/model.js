import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { FetchGet,FetchPost } from 'utils/fetch'
import queryString from 'query-string'
import axios from 'axios'
const { prefix,apiPrefix,baseURL } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) !== 'true',
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
        console.log('menuData',menuData);
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
            pathname: '/dashboard',
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
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },
    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    }
  },
  subscriptions: {
    setupHistory ({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
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
