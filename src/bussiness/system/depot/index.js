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
@connect(({ depot, loading }) => ({
  depot,
  loading: loading.effects['depot/loadChild'],
}))
@Form.create()
export default class DepotList extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'depot/loadTree'});
  }
  setProps = (payload) => {
    this.props.dispatch({type:'depot/fetchEnd',payload});
  }
  onAddButton = () => {
    const { form } = this.props;
    form.resetFields();
    this.setProps({modalVisible: true,editing:false});
  }
  buildColumns = () => {
    const { form,dispatch } = this.props;
    const editClick = (record) => {
      dispatch({type:'depot/loadOne',payload:{id:record.id,callback:(data)=>{
            form.setFieldsValue({
              id:data.id,
              name:data.name,
              description:data.description,
              serialNum:data.serialNum
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
          dispatch({type:'depot/deleteOne',payload:{id:record.id}})
        },
        onCancel() {},
      })
    }
    return [
      {title:'ID',dataIndex:'id'},
      {title:'序号',dataIndex:'serialNum'},
      {title:'名称',dataIndex:'name'},
      {title:'描述',dataIndex:'description'},
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
    const { form, depot:{defaultSerialNum,modalVisible,editing} } = this.props;
    const handleModalOK = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        this.props.dispatch({
          type: `depot/${editing ? 'updateOne' : 'addOne'}`,
          payload: fieldsValue,
        });
        this.setProps({modalVisible: false});
      });
    }
    return (
      <Modal title={`${editing ? '编辑' : '添加'}部门`} okText={'确定'} cancelText={'取消'} visible={modalVisible} onOk={handleModalOK} onCancel={() => this.setProps({modalVisible: false})}>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ID">
          {form.getFieldDecorator('id')(<Input disabled={true}/>)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('name',{rules: [{ required: true, message: '请输入名称...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
          {form.getFieldDecorator('description',{rules: [{ required: true, message: '请输入描述...' }]})(<Input placeholder="请输入" />)}
        </Form.Item>
        <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="顺序">
          {form.getFieldDecorator('serialNum',{initialValue:defaultSerialNum,rules: [{ required: true, message: '请输入顺序...' }]})(<InputNumber min={0} max={100} placeholder="请输入" />)}
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
      type: 'depot/loadChild',
      payload: params,
    });
  }
  buildTree = ({data}) => {
    const dptTree = arrayToTree(data, 'id', 'parentId')
    const onSelect = (selectedKeys, info) => {
      if(selectedKeys.length > 0){
        const depotId = selectedKeys[0];
        this.props.dispatch({
          type: 'depot/loadChild',
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
    const { height,loading,depot } = this.props;
    return (
      <Layout>
        <Sider width={200} style={{ background: '#fff',height: height }}>
          <Card title="部门列表" bordered={false}>
            <this.buildTree data={depot.tree}/>
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
                data={depot.data}
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
