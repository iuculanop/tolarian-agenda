import React from 'react';
import { Col, Card } from 'antd';
import { CopyOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CardUpdate from './CardUpdate';
import { cardQuantity,
    formatQuantity,
    cardLink,
  } from '../utils/CardCollection';
import { basepath } from '../AppConfig';


function MtgBinder(props) {
    const imgSrc = basepath+'binder.png';
    return (
        <Col key={props.binder.binderId} span={3}>
            <Card
                hoverable
                style={{ width: '100%' }}
                cover={<img style={{ width: '95%', padding: '2px' }} alt={props.binder.binderName} src="https://hdclipartall.com/images/binders-clipart-work-binder-clip-art-300_300.png" />}
            >
                <Card.Meta title={props.binder.binderName} description={props.binder.creationDate} />
            </Card>
        </Col>
    );
}

export default MtgBinder;