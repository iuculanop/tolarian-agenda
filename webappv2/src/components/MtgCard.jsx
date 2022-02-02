import React from 'react';
import { Col, Card } from 'antd';
import { CopyOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import CardUpdate from './CardUpdate';
import { cardQuantity,
    formatQuantity,
    cardLink,
    getCollectedItems,
  } from '../utils/CardCollection';


function MtgCard(props) {
    console.warn('props di MtgCard:',props);
    return (
        <Col key={props.mtgcard.multiverseid} span={3}>
          <Card
            className="mtg-card"
            cover={<div className="card-wrapper">
              <div className="counter">
                <CopyOutlined />
                <span className="count">
                  {formatQuantity(cardQuantity(props.mtgcard.multiverseid,
                    props.coll))}
                </span>
              </div>
              <img className="full-width" alt={props.mtgcard.name} src={props.mtgcard.imageUrl} />
            </div>}
            actions={
            [<CardUpdate 
              card={{info: props.mtgcard, quantity: cardQuantity(props.mtgcard.multiverseid, props.coll), items: getCollectedItems(props.mtgcard.multiverseid, props.coll)}} 
              {...props} 
            />,
              <Link to={cardLink(props.mtgcard)}><EyeOutlined /></Link>,
              <EllipsisOutlined />,
            ]}
          >
            <Card.Meta
              className="no-display"
            />
          </Card>
        </Col>
    );
}

export default MtgCard;