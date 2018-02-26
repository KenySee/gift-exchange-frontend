import React, {PureComponent, Fragment, Component} from 'react';
import { connect } from 'dva';
import autoHeight from 'antpro/Charts/autoHeight';
import StandardTable from 'antpro/StandardTable';
import { arrayToTree } from 'utils'
import { Row, Col, Tree, Card, Layout, Form, Breadcrumb,Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
const { Header, Content, Sider } = Layout;
import styles from './index.less';

@autoHeight()
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.effects['menu/loadChild'],
}))
@Form.create()
export default class MenuList extends Component {
  state = {
    formValues: {},
  }
  setProps = (payload) => {
    this.props.dispatch({type:'menu/fetchEnd',payload});
  }
  onAddButton = () => {
    const { form } = this.props;
    form.resetFields();
    this.setProps({modalVisible: true});
  }
  buildColumns = () => {
    const { form,dispatch } = this.props;
    const editClick = (record) => {
      dispatch({type:'menu/loadOne',payload:{id:record.id,callback:(data)=>{
            form.setFieldsValue({
              id:data.id,
              icon:data.icon,
              name:data.name,
              path:data.path,
              serialNum:data.serialNum
            });
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
          dispatch({type:'menu/deleteOne',payload:{id:record.id}})
        },
        onCancel() {},
      })
    }
    return [
      {title:'ID',dataIndex:'id'},
      {title:'序号',dataIndex:'serialNum'},
      {title:'图标',dataIndex:'icon'},
      {title:'名称',dataIndex:'name'},
      {title:'路径',dataIndex:'path'},
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
    const { form, menu:{defaultSerialNum,modalVisible} } = this.props;
    const handleModalOK = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.props.dispatch({
          type: `menu/${fieldsValue.id ? 'updateOne' : 'addOne'}`,
          payload: fieldsValue,
        });
        message.success(`${fieldsValue.id ? '更新' : '添加'}成功`);
        this.setProps({modalVisible: false});
      });
    }
    return (
      <Modal title="新建菜单" visible={modalVisible} onOk={handleModalOK} onCancel={() => this.setProps({modalVisible: false})}>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID">
          {form.getFieldDecorator('id')(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标">
          {form.getFieldDecorator('icon',{rules: [{ required: true, message: '请输入图标...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name',{rules: [{ required: true, message: '请输入名称...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路径">
          {form.getFieldDecorator('path',{rules: [{ required: true, message: '请输入路径...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="顺序">
          {form.getFieldDecorator('serialNum',{initialValue:defaultSerialNum,rules: [{ required: true, message: '请输入顺序...' }]})(<InputNumber min={0} max={100} placeholder="请输入" />)}
        </Form.Item>
      </Modal>
    )
  }
  componentDidMount() {
    this.props.dispatch({type: 'menu/loadTree'});
  }
  handlePaginationChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      limit: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'menu/loadChild',
      payload: params,
    });
  }
  buildTree = ({data}) => {
    const menuTree = arrayToTree(data, 'id', 'parentId')
    const onSelect = (selectedKeys, info) => {
      if(selectedKeys.length > 0){
        const menuId = selectedKeys[0];
        this.props.dispatch({
          type: 'menu/loadChild',
          payload: {id:menuId,page:1,limit:10},
        });
      }
    }
    const getMenus = (menuTreeN) => {
      return menuTreeN.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.name} key={item.id}>
              {getMenus(item.children)}
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
        {getMenus(menuTree)}
      </Tree>
    )
  }
  render() {
    const { height,loading,menu } = this.props;
    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff',height: height }}>
          <Card title="菜单列表" bordered={false}>
            <this.buildTree data={menu.tree}/>
          </Card>
        </Sider>
        <Layout style={{ paddingLeft: 24 }}>
          <Card bordered={false} style={{ background: '#fff',height: height }}>
            <div className={styles.tableList}>
              <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={this.onAddButton}>
                  新建
                </Button>
              </div>
              <StandardTable
                loading={loading}
                data={menu.data}
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
