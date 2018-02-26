import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from './bussiness/system/app'
const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const error = dynamic({
    app,
    component: () => import('./bussiness/system/error'),
  })
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./bussiness/dashboard/model')],
      component: () => import('./bussiness/dashboard'),
    },{
      path: '/system/menu',
      models: () => [import('./bussiness/system/menu/model')],
      component: () => import('./bussiness/system/menu'),
    },{
      path: '/system/depot',
      models: () => [import('./bussiness/system/depot/model')],
      component: () => import('./bussiness/system/depot'),
    },{
      path: '/login',
      models: () => [import('./bussiness/login/model')],
      component: () => import('./bussiness/login'),
    }
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
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
