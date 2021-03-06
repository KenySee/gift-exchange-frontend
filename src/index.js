import { message } from 'antd'
import dva from 'dva'
import createLoading from 'dva-loading'
import createHistory from 'history/createBrowserHistory'
import 'babel-polyfill'

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError (error) {
    message.error(error.message)
  },
})
// app.use(createLoading());
// 2. Model
app.model(require('./bussiness/system/app/model'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
