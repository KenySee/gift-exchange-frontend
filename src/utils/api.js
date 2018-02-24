const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
module.exports = {
  userLogin: `${APIV1}/user/login`,
  userLogout: `${APIV1}/user/logout`,
  userInfo: `${APIV1}/userInfo`,
  users: `${APIV1}/users`,
  posts: `${APIV1}/posts`,
  user: `${APIV1}/user/:id`,
  analysis: `${APIV1}/analysis`,
  dashboard: `${APIV1}/dashboard`,
  menus: `${APIV1}/menus`,
  weather: `${APIV1}/weather`,
  v1test: `${APIV1}/test`,
  v2test: `${APIV2}/test`,
}
