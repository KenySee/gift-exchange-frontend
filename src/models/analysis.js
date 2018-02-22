import modelExtend from 'dva-model-extend'
import { model } from 'models/common'
import * as analysisService from 'services/analysis'

export default modelExtend(model, {
  namespace: 'analysis',

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

  effects: {
    *fetch(payload = {}, { call, put }) {
      const response = yield call(analysisService.query, payload);
      yield put({
        type: 'save',
        payload: {...response,initData:false},
      });
    },
    *fetchSalesData(payload = {}, { call, put }) {
      const response = yield call(analysisService.query, payload);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
          initData: false
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
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
    },
  },
});
