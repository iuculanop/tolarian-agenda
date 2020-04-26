import React, { PropTypes } from 'react';
import { Form, Row, Col, Button, Select, Input, Switch } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;

function scanInput(inputValue, option) {
  if (option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1) {
    return true;
  }
  return false;
}

/* eslint-disable */
class CardSearchForm extends React.Component {
  state = {
    expand: false,
  };

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
    };
    const children = [];
    const filterValues = this.props.filterValues;
    console.warn('debug getFields filterValues=', filterValues);
    children.push(
      <Col span={12} key="name" style={{ display: 'block' }}>
        <FormItem label={"Nome Carta"}>
          {getFieldDecorator("name",{ initialValue: filterValues.name })(
            <Input
              placeholder="nome carta"
              allowClear={true}
            />
          )}
        </FormItem>
      </Col>
    );
    children.push(
      <Col span={12} key="setCode" style={{ display: 'block' }}>
        <FormItem label={"Espansione"}>
          {getFieldDecorator("setCode",{ initialValue: filterValues.setCode })(
            <Select
              showSearch
              placeholder="espansione"
              filterOption={scanInput}
              allowClear
            >
              {this.props.sets}
            </Select>
          )}
        </FormItem>
      </Col>
    );
    return children;
  }

  handleSearch = (e) => {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    console.log('Received values of form: ', values);
    const nextFilterValues = _.clone(this.props.filterValues);
    nextFilterValues.name = values.name || '';
    nextFilterValues.setCode = values.setCode || '';
    console.log('prepared filterValues to pass', nextFilterValues);
    this.props.fetchCards(nextFilterValues);
  }

  handleReset = () => {
    const emptyFields = {
      name: '',
      setCode: '',
    };
    this.props.form.setFieldsValue(emptyFields);
    // this.props.form.resetFields();
  }

  setSwitchState = (mode) => {
    if (mode === 'table') return false;
    return true;
  }

  handleSwitch = (checked) => {
    this.props.changeViewMode(checked);
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  render() {
    // console.log('debug registry form:', this.props);
    const formFields = this.getFields();
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={40}>{formFields}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <span>Anteprima Carte:</span>
            <Switch
              checked={this.setSwitchState(this.props.viewMode)}
              onChange={this.handleSwitch}
            />
            <Button type="primary" htmlType="submit">Cerca</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Resetta Filtri
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

CardSearchForm.propTypes = {
  filterValues: PropTypes.object.isRequired,
  sets: PropTypes.arrayOf(PropTypes.object).isRequired,
  viewMode: PropTypes.string,
  fetchCards: PropTypes.func.isRequired,
  changeViewMode: PropTypes.func.isRequired,
};

const WrappedCardSearchForm = Form.create()(CardSearchForm);

export default WrappedCardSearchForm;
