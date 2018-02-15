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
  },

  effects: {
    *fetch(payload = {}, { call, put }) {
      const response = yield call(analysisService.query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchSalesData(payload = {}, { call, put }) {
      const response = yield call(analysisService.query, payload);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
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
