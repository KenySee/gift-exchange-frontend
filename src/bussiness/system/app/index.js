import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Loader, MyLayout } from 'components'
import { BackTop, Layout } from 'antd'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import GlobalHeader from 'antpro/GlobalHeader';
import Error from '../error'
import '../../../themes/index.less'
import './index.less'

const { Content, Header, Footer, Sider } = Layout
const { Bread, styles } = MyLayout
const { prefix, openPages } = config

let lastHref

const App = ({
               children, dispatch, app, fetchingNotices, loading, location,
             }) => {
  const {
    user, notices, collapsed, siderFold, darkTheme, isNavbar, menuPopoverVisible, navOpenKeys, menu,
  } = app
  let { pathname } = location
  let { menuList } = user
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menuList.filter(item => pathToRegexp(item.path || '').exec(pathname))
  const hasPermission = current.length > 0;
  const { href } = window.location

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    location,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu,
    user,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const breadProps = {
    menu,
    location,
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }
  const handleMenuCollapse = (collapsed) => {
    dispatch({
      type: 'app/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  const handleNoticeClear = (type) => {
    dispatch({
      type: 'app/clearNotices',
      payload: type,
    });
  }
  const handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'app/logout',
      });
    }
  }
  const handleNoticeVisibleChange = (visible) => {
    if (visible) {
      dispatch({
        type: 'app/fetchNotices',
      });
    }
  }
  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>ANTD ADMIN</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>

      <Layout className={classnames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })}>
        {!isNavbar && <Sider
          trigger={null}
          collapsible
          collapsed={siderFold}
        >
          {siderProps.menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
        </Sider>}
        <Layout style={{ height: '100vh', overflow: 'scroll' }} id="mainContainer">
          <BackTop target={() => document.getElementById('mainContainer')} />
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={user}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={false}
              onNoticeClear={handleNoticeClear}
              onCollapse={handleMenuCollapse}
              onMenuClick={handleMenuClick}
              onNoticeVisibleChange={handleNoticeVisibleChange}
            />
          </Header>
          <Content>
            <Bread {...breadProps} />
            {hasPermission ? children : <Error />}
          </Content>
          <Footer >
            {config.footerText}
          </Footer>
        </Layout>
      </Layout>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading,fetchingNotices: loading.effects['app/fetchNotices'] }))(App))
