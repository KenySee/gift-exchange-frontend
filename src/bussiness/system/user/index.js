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
@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/loadChild'],
}))
@Form.create()
export default class UserList extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'user/loadTree'});
  }
  setProps = (payload) => {
    this.props.dispatch({type:'user/fetchEnd',payload});
  }
  onAddButton = () => {
    const { form } = this.props;
    form.resetFields();
    this.setProps({modalVisible: true,editing:false});
  }
  buildColumns = () => {
    const { form,dispatch } = this.props;
    const editClick = (record) => {
      dispatch({type:'user/loadOne',payload:{id:record.id,callback:(data)=>{
            form.setFieldsValue({
              id:data.id,
              username:data.username,
              realname:data.realname,
              mobile:data.mobile,
              headimage:data.headimage
            });
            this.setProps({modalVisible: true,editing:true});
      }}})
    }
    const removeClick = (record) => {
      Modal.confirm({
        title: '删除后无法恢复,你确定要删除码?',
        content: '',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          dispatch({type:'user/deleteOne',payload:{id:record.id}})
        },
        onCancel() {},
      })
    }
    return [
      {title:'ID',dataIndex:'id'},
      {title:'登录名',dataIndex:'username'},
      {title:'真实姓名',dataIndex:'realname'},
      {title:'手机号',dataIndex:'mobile'},
      {title:'个人头像',dataIndex:'headimage'},
      {
        title: '操作',
        render: (text, record, index) => (
          <Fragment>
            <Button onClick={()=>{editClick(record)}}>编辑</Button>
            <Divider type="vertical" />
            <Button type="danger" onClick={()=>{removeClick(record)}}>删除</Button>
          </Fragment>
        )
      }
    ]
  }
  buildForm = (props) => {
    const { form, user:{modalVisible,editing} } = this.props;
    const handleModalOK = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.props.dispatch({
          type: `user/${editing ? 'updateOne' : 'addOne'}`,
          payload: fieldsValue,
        });
        this.setProps({modalVisible: false});
      });
    }
    return (
      <Modal title={`${editing ? '编辑' : '添加'}用户`} okText={'确定'} cancelText={'取消'} visible={modalVisible} onOk={handleModalOK} onCancel={() => this.setProps({modalVisible: false})}>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID">
          {form.getFieldDecorator('id')(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名">
          {form.getFieldDecorator('username',{rules: [{ required: true, message: '请输入登录名...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="真实姓名">
          {form.getFieldDecorator('realname',{rules: [{ required: true, message: '请输入真实姓名...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号">
          {form.getFieldDecorator('mobile',{rules: [{ required: true, message: '请输入手机号...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="个人头像">
          {form.getFieldDecorator('headimage',{initialValue:'',rules: [{ required: true, message: '请输入...' }]})(<InputNumber min={0} max={100} placeholder="请输入" />)}
        </Form.Item>
      </Modal>
    )
  }
  handlePaginationChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'user/loadChild',
      payload: params,
    });
  }
  buildTree = ({data}) => {
    const dptTree = arrayToTree(data, 'id', 'parentId')
    const onSelect = (selectedKeys, info) => {
      if(selectedKeys.length > 0){
        const depotId = selectedKeys[0];
        this.props.dispatch({
          type: 'user/loadChild',
          payload: {id:depotId,page:1,limit:10},
        });
      }
    }
    const getDepots = (dptTreeN) => {
      return dptTreeN.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id}>
              {getDepots(item.children)}
            </TreeNode>
          )
        }
        else{
          return (
            <TreeNode title={item.name} key={item.id} />
          )
        }
      })
    }
    return (
      <Tree showLine defaultExpandedKeys={['1']} onSelect={onSelect}>
        {getDepots(dptTree)}
      </Tree>
    )
  }
  render() {
    const { height,loading,user } = this.props;
    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff',height: height }}>
          <Card title="部门列表" bordered={false}>
            <this.buildTree data={user.tree}/>
          </Card>
        </Sider>
        <Layout style={{ paddingLeft: 24 }}>
          <Card bordered={false} style={{ background: '#fff',height: height }}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={this.onAddButton}>
                  添加
                </Button>
              </div>
              <StandardTable
                loading={loading}
                data={user.data}
                columns={this.buildColumns()}
                onChange={this.handlePaginationChange}
              />
            </div>
          </Card>
          <this.buildForm/>
        </Layout>
      </Layout>
    )
  }
}
