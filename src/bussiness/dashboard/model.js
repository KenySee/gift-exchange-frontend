import { mockAjax } from 'utils'

export default {
  namespace: 'dashboard',
  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    loading: false,
    initData:true
  },
  reducers: {
    fetchEnd(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    }
  },
  effects: {
    *fetch(payload = {}, { call, put }) {
      const response = yield call(mockAjax,`/dashboard`, {method: 'get'});
      console.log('dashboard/effects',response);
      yield put({
        type: 'fetchEnd',
        payload: {...response,initData:false},
      });
    },
    *fetchSalesData(payload = {}, { call, put }) {
      const response = yield call(mockAjax,`/dashboard`, {method: 'get'});
      yield put({
        type: 'fetchEnd',
        payload: {
          salesData: response.salesData,
          initData: false
        },
      });
    },
  }
};
