import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Drawer, Form, InputNumber, Button, Card, message, Select, List } from 'antd';
import { PlusSquareTwoTone } from '@ant-design/icons';
import { cardLanguages } from '../utils/CardCollection';
import { generateLanguageOptions } from './SelectUtils';

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

    const data = [
        {
          title: 'Ant Design Title 1',
        },
        {
          title: 'Ant Design Title 2',
        },
        {
          title: 'Ant Design Title 3',
        },
        {
          title: 'Ant Design Title 4',
        },
      ];

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
                <List
                    itemLayout="vertical"
                    dataSource={data}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<img src={props.card.info.imageUrl} />}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                    )}
                />
                <Form 
                    layout="horizontal"
                    form={form} 
                    name="update-collection"
                    initialValues={{'quantity': props.card.quantity.qty, 'foilQuantity': props.card.quantity.foilQty}} 
                    onFinish={handleSubmit}
                >
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