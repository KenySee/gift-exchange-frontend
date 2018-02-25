import fetch from 'dva/fetch';
const config = require('./config')
const { apiPrefix } = config

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default async function mockAjax(url, options) {
  const response = await fetch(apiPrefix+url, options);
  const data = await response.json();
  return data;
}
