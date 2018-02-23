const APIV1 = '/mock/v1'
const APIV2 = '/mock/v2'
import apiConfig from './api'
module.exports = {
  name: 'AntD Admin',
  prefix: 'antdAdminV',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: '/logo.svg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: [],
  baseURL:'http://localhost:3200',
  openPages: ['/login'],
  apiPrefix: '/mock/v1',
  APIV1,
  APIV2,
  api: apiConfig
}
