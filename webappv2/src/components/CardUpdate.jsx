import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Drawer, Form, InputNumber, Button, Card, message } from 'antd';
import { PlusSquareTwoTone } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

function CardUpdate(props) {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    function onView(event) {
        event.preventDefault();
        setVisible(true);
    }

    function onClose() {
        setVisible(false);
    }

    async function handleSubmit(values) {
        //window.sessionStorage.setItem('values', JSON.stringify(values));
        // console.warn('form update-collection values:',values);
        const nc = {
            id_card: props.card.info.multiverseid,
            card_name: props.card.info.name,
            card_names: props.card.info.names,
            rarity: props.card.info.rarity,
            number: props.card.info.number,
            mtg_set: props.card.info.set,
            quantity: values.quantity,
            foil: (values.quantityFoil > 0 ? true : false),
            foil_quantity: values.quantityFoil,
        };
        console.warn('card to add in collection', nc);
        try {
            await new Promise((resolve, reject) =>
                props.addCard(resolve, reject, nc)
            );
            console.warn('ho effettuato la chiamata ajax!');
        } catch (error) {
            console.warn('errore collection update! ', error);
            message.error('Cannot add card to collection! Error here.');
            // setLoading(false);
        }
    };

    return (
        <>
            <Link to="#" onClick={(event => onView(event))} ><PlusSquareTwoTone title="Add to collection" style={{ fontSize: '20px' }}/></Link>
            <Drawer  visible={visible} onClose={onClose} width="25%" title="Add to collection">
                <div className="mtg-card-drawer">
                <Card
                    className="mtg-card"
                    style={{ width: '70%', border: 'none' }}
                    cover={<img alt={props.card.info.name} src={props.card.info.imageUrl} />}
                >
                </Card>
                <Form 
                    layout="inline"
                    form={form} 
                    name="update-collection"
                    initialValues={{'quantity': props.card.quantity.qty, 'foilQuantity': props.card.quantity.foilQty}} 
                    onFinish={handleSubmit}
                >
                    <Form.Item name="quantity" label="Copies Owned">
                        <InputNumber min={0} placeholder="Normal copies owned" />
                    </Form.Item>
                    <Form.Item name="foilQuantity" label="Foil Copies Owned">
                        <InputNumber min={0} placeholder="Foil copies owned" />
                    </Form.Item>
                    <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        Cerca
                    </Button>
                    </Form.Item>
                </Form>
                </div>
            </Drawer>
        </>
    )

    
}

export default CardUpdate;