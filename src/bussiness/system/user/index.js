import React, {PureComponent, Fragment, Component} from 'react';
import { connect } from 'dva';
import autoHeight from 'antpro/Charts/autoHeight';
import StandardTable from 'antpro/StandardTable';
import { arrayToTree } from 'utils'
import { Row, Col, Tree, Card, Layout, Form, Breadcrumb,Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const { Header, Content, Sider } = Layout;
import styles from "../../utils.less";

@autoHeight()
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/loadAll'],
}))
@Form.create()
export default class UserList extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'user/loadAll'});
  }
  render() {
    return (
      <Layout>
      </Layout>
    )
  }
}
