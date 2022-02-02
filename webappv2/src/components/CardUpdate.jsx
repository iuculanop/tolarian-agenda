import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Drawer, Form, InputNumber, Button, Row, message, Select, List } from 'antd';
import { PlusSquareTwoTone } from '@ant-design/icons';
import { cardLanguages, getBinderName } from '../utils/CardCollection';
import { generateLanguageOptions, generateBinderOptions } from './SelectUtils';

const { Text, Title, Paragraph } = Typography;

function CardUpdate(props) {
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [form] = Form.useForm();
    const binders = (props.binders && props.binders.value ? props.binders.value.payLoad : []);
    const btnTitle = (formVisible ? 'Close' : 'Add to Collection')

    function onView(event) {
        event.preventDefault();
        setVisible(true);
    }

    function onClose() {
        setVisible(false);
    }

    function toggleForm(event) {
        event.preventDefault();
        setFormVisible(!formVisible);
    }

    async function handleSubmit(values) {
        //window.sessionStorage.setItem('values', JSON.stringify(values));
        console.warn('form update-collection values:',values);
        const langId = values.language.split('_');
        const nc = {
            id_card: props.card.info.multiverseid,
            card_name: props.card.info.name,
            card_names: props.card.info.names,
            id_lang: langId[0],
            language: langId[1],
            rarity: props.card.info.rarity,
            number: props.card.info.number,
            mtg_set: props.card.info.set,
            quantity: values.quantity,
            foil: (values.foilQuantity > 0 ? true : false),
            foil_quantity: values.foilQuantity,
            id_binder: values.binder,
        };
        console.warn('card to add in collection', nc);
        try {
            await new Promise((resolve, reject) =>
                props.addCard(resolve, reject, nc)
            );
            console.warn('ho effettuato la chiamata ajax!');
            setFormVisible(false);
        } catch (error) {
            console.warn('errore collection update! ', error);
            message.error('Cannot add card to collection! Error here.');
            // setLoading(false);
        }
    };

    return (
        <>
            <Link to="#" onClick={(event => onView(event))} ><PlusSquareTwoTone title="Add to collection" style={{ fontSize: '20px' }}/></Link>
            <Drawer visible={visible} onClose={onClose} keyboard width="25%" title={props.card.info.name}>
                <Title level={5}>Stored in Collection:</Title>
                <List
                    className="collected-items"
                    itemLayout="horizontal"
                    loading={(props.collection ? props.collection.pending : false)}
                    dataSource={props.card.items}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta className="coll-cards"
                            avatar={<img src={props.card.info.imageUrl} style={{ width: '100%'}} />}
                            title={<a href="https://ant.design">binder <b>"{getBinderName(item.id_binder, binders)}"</b></a>}
                            description={`Language: ${item.language} Normal: ${item.quantity} Foil: ${item.foil_quantity}`}
                        />
                    </List.Item>
                    )}
                />
                <Row style={{ justifyContent: 'center' , marginBottom: '10px' }}>
                    <Button type="primary" onClick={toggleForm} >{btnTitle}</Button>
                </Row>
                {
                    formVisible && 
                    <Form 
                        layout="horizontal"
                        form={form} 
                        name="update-collection"
                        initialValues={{'quantity': 0, 'foilQuantity': 0, 'language': `${props.card.info.multiverseid}_English`}} 
                        onFinish={handleSubmit}
                    >
                        <Form.Item name="binder" label="Binder">
                            <Select style={{ width: '100%'}}>
                                {generateBinderOptions(binders)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="language" label="Language">
                            <Select style={{ width: '100%' }}>
                                {generateLanguageOptions(cardLanguages(props.card.info))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="quantity" label="Copies Owned">
                            <InputNumber min={0} placeholder="Normal copies owned" />
                        </Form.Item>
                        <Form.Item name="foilQuantity" label="Foil Copies Owned">
                            <InputNumber min={0} placeholder="Foil copies owned" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" >
                                Add
                            </Button>
                        </Form.Item>
                    </Form>
                }
            </Drawer>
        </>
    )

    
}

export default CardUpdate;