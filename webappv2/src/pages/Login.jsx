import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import ajaxMe from '../ajax/me';
import { setUserSession } from '../utils/common';

function Login(props) {

  const [status, setStatus] = useState({ loading: false, error: false});
  let navigate = useNavigate();
  const me = props.me;
  const ldata = props.loginData;

  async function onFinish(values) {
    setStatus({loading: true, error: false});
    try {
      await new Promise((resolve, reject) =>
        props.login(resolve, reject, {username: values.username, password: values.password})
      );
      setStatus({loading: false, error: false });
      navigate('../dashboard', { replace: true });
    } catch (error) {
      console.warn('errore auth! ', error);
      setStatus({loading: false, error: true });
      // message.error('Il passaggio di fase non è andato a buon fine. Si prega di riprovare più tardi o di contattare l\'ufficio grupposvil@unimi.it');
      // setLoading(false);
    }
  };

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  useEffect(function() {
    if (ldata && ldata.fulfilled && ldata.value != null) {
      // console.warn('stato del contesto: ', meCtx);
      setUserSession(ldata.value.payLoad.Token, ldata.value.payLoad.id_name);
    }
  }, [ldata]);

  if (props.me.value != null) {
    navigate('../dashboard', {replace: true});
  }
  
  return (
    <Row justify="center"><Col span={8}>
      <Form
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          style={{ width: '100%' }}
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username"/>
        </Form.Item>

        <Form.Item
          style={{ width: '100%' }}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password"/>
        </Form.Item>

        <Form.Item style={{ width: '100%', textAlign: 'center' }} name="remember" valuePropName="checked" >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item style={{ width: '100%' , textAlign: 'center' }} >
          <Button type="primary" htmlType="submit" loading={status.loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Col></Row>
  );
}

export default ajaxMe(Login);