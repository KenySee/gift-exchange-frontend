import React from 'react'
import PropTypes from 'prop-types'
import { LocaleProvider, Spin } from 'antd';
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from './bussiness/core/app'
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./bussiness/core/error'),
  })
  const routes = [
    {
      path: '/system/menu',
      models: () => [import('./models/analysis')],
      component: () => import('./routes/analysis/'),
    },{
      path: '/system/user',
      models: () => [import('./models/analysis')],
      component: () => import('./routes/analysis/'),
    },{
      path: '/system/role',
      models: () => [import('./models/analysis')],
      component: () => import('./routes/analysis/'),
    },{
      path: '/bussiness/order',
      models: () => [import('./models/analysis')],
      component: () => import('./routes/analysis/'),
    },{
      path: '/login',
      models: () => [import('./bussiness/core/login/model')],
      component: () => import('./bussiness/core/login'),
    }
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/analysis" />)} />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
          <Route component={error} />
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
