import React from 'react';
import { connect } from 'dva';
import { Iconfont, Page } from 'components'
import styles from './IndexPage.css';
import iconStyle from './index.less'
const localRequireSVGIcons = [
  require('svg/cute/congratulations.svg'),
  require('svg/cute/cry.svg'),
  require('svg/cute/kiss.svg'),
  require('svg/cute/leisurely.svg'),
  require('svg/cute/notice.svg'),
  require('svg/cute/proud.svg'),
  require('svg/cute/shy.svg'),
  require('svg/cute/sweat.svg'),
  require('svg/cute/think.svg'),
]
function IndexPage() {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Yay! Welcome to dva</h1>
      <h2 style={{ margin: '16px 0' }}>Local Require SVG</h2>
      <ul className={iconStyle.list}>
        {localRequireSVGIcons.map(item => (<li key={item.default.id}>
          <Iconfont className={iconStyle.icon} colorful type={item.default.id} />
          <span className={iconStyle.name}>{item.default.id}</span>
        </li>))}
      </ul>
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
