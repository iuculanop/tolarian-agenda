import React from 'react';
import { Form, Input, Button } from 'antd';
import ajaxCards from '../../ajax/cards';

function Search(props) {
  return (
    <>
      <Form
        layout="inline"
      >
        <Form.Item label="Field A">
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item label="Field B">
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Cerca</Button>
        </Form.Item>
      </Form>
      </>
  );
}

export default ajaxCards(Search);