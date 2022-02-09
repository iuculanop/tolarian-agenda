import React, { useState } from 'react';
import { Button, message, Row, Col, Tooltip, Divider, Table, Card, Spin, Form, Drawer, Input } from 'antd';

function AddBinder(props) {
    const [form] = Form.useForm();

    async function handleSubmit(values) {
        console.warn('AddBinder form vals:',values);
        const nb = {
            binderName: values.name,
        }
        try {
            await new Promise((resolve, reject) =>
                props.addBinder(resolve, reject, nb)
            );
        } catch (error) {
            message.error('Cannot create binder! Error here.');
        }
        props.onClose();
    }

    return (
        <Drawer visible={props.visible} onClose={props.onClose}>
            <Form 
                layout="horizontal"
                form={form} 
                name="add-binder"
                onFinish={handleSubmit}
            >
                <Form.Item name="name" label="Name">
                    <Input placeholder="Binder name" />
                </Form.Item>
                Upload image file here.
                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
}

export default AddBinder;