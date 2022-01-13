import React, { useState } from 'react';
import { Button, message, Row, Col, Tooltip, Divider, Table, Card, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { UnorderedListOutlined, TableOutlined, CopyOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import ajaxCards from '../../ajax/cards';
import CardSearch from '../../components/CardSearch';
import { cardQuantity,
  formatQuantity,
  wishQuantity,
  cardNameFormatter,
  cardLink,
  cardRowKey,
} from '../../utils/CardCollection';

function SearchList(props) {
  const [viewMode, setViewMode] = useState('list');

  function toggleView() {
    if (viewMode === 'list') {
      setViewMode('grid')
    } else {
      setViewMode('list')
    }
  }

  async function handleSearch(fltrValues) {
    // console.warn(fltrValues);
    try {
      await new Promise((resolve, reject) =>
        props.search(resolve, reject, fltrValues.cardName || '', fltrValues.setCode || '')
      );
      console.warn('ho effettuato la chiamata ajax!');
    } catch (error) {
      console.warn('errore search! ', error);
      message.error('La ricerca non è andata a buon fine. Si prega di riprovare più tardi');
      // setLoading(false);
    }
  }

  const tooltipTitle = (viewMode === 'list' ? 'Grid view' : 'List view');
  const btnIcon = (viewMode === 'list' ? <TableOutlined/> : <UnorderedListOutlined/>);

  function renderCards(cards) {
    return (
      cards.map(card => (
        <Col key={card.multiverseid} span={3}>
          <Card
            className="mtg-card"
            cover={<div className="card-wrapper">
              <div className="counter">
                <CopyOutlined />
                <span className="count">
                  {formatQuantity(cardQuantity(card.multiverseid,
                    props.collection))}
                </span>
              </div>
              <img className="full-width" alt={card.name} src={card.imageUrl} />
            </div>}
            actions={
            [<Button
              card={{
                info: card,
                quantity: cardQuantity(card.multiverseid, props.collection) }}
              onUpdate={props.updateCard}
              viewMode={props.viewMode}
              updateType="add"
            />,
              <Button
                card={{
                  idCard: card.multiverseid,
                  idSet: card.set,
                  quantity: cardQuantity(card.multiverseid, 10, props.collection) }}
                onUpdate={props.removeCard}
                updateType="remove"
              />,
              <Link to={cardLink(card)}><EyeOutlined /></Link>,
              <EllipsisOutlined />,
            ]}
          >
            <Card.Meta
              className="no-display"
            />
          </Card>
        </Col>
      ))
    );
  }

  const columns = [
    {
      title: 'Carta',
      dataIndex: 'name',
      key: 'name',
      render: (text, row) => <Link style={{ color: '#547192' }} to={cardLink(row)}>{cardNameFormatter(row)}</Link>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'cardType',
    },
    {
      title: 'Edizione',
      dataIndex: 'setName',
      key: 'setName',
    },
    {
      title: 'Rarità',
      dataIndex: 'rarity',
      key: 'rarity',
    },
    {
      title: 'Numero di Collezione',
      dataIndex: 'number',
      key: 'collNumber',
    },
    {
      title: 'Quantità posseduta(foil)',
      dataIndex: 'multiverseid',
      render: id => formatQuantity(cardQuantity(id, props.collection)),
    },
    {
      title: 'Azioni',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            card={{
              info: record,
              quantity: cardQuantity(record.multiverseid, props.collection),
            }}
            onUpdate={props.updateCard}
            viewMode={props.viewMode}
          />
          <Divider type="vertical" />
          <Button
            card={{
              info: record,
              quantity: wishQuantity(record.multiverseid, 10, props.wishlist || []),
            }}
            onUpdate={props.updateWishlist}
            viewMode={props.viewMode}
          />
        </span>
      ),
    },
  ];

  const results = (props.searchResults && props.searchResults.value ? props.searchResults.value.payLoad : []);

  return (
    <>
      <CardSearch onSearch={handleSearch} sets={props.sets} results={props.searchResults} />
      <Row justify="center" align="middle">
        {results.length > 0 && (
          <Col style={{ textAlign: 'center', marginRight: '20px' }}>
            <b>Sono stati trovati {results.length} risultati!</b>
          </Col>
        )}    
        <Col>
          <Tooltip title={tooltipTitle}>
            <Button icon={btnIcon} onClick={toggleView}/>
          </Tooltip>
        </Col>
      </Row>
      {
        viewMode === 'list' && 
        <Table
            rowKey={cardRowKey}
            size='small'
            columns={columns}
            dataSource={results}
        />
      }
      {
        viewMode === 'grid' &&
        <Spin spinning={(props.searchResults ? props.searchResults.pending : false)}>
          <Row gutter={16}>
            {renderCards(results)}
          </Row>
        </Spin>
      }
    </>
  );
}

export default ajaxCards(SearchList);