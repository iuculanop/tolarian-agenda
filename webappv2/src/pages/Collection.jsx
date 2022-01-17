import React, { useState } from 'react';
import { Button, message, Row, Col, Tooltip, Divider, Table, Card, Spin, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import { UnorderedListOutlined, TableOutlined, DatabaseOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import ajaxCards from '../ajax/cards';
import CardSearch from '../components/CardSearch';
import { cardQuantity,
  formatQuantity,
  wishQuantity,
  cardNameFormatter,
  cardLink,
  cardRowKey,
  getCollectedItems,
} from '../utils/CardCollection';
import CardUpdate from '../components/CardUpdate';
import MtgBinder from '../components/MtgBinder';
import MtgCard from '../components/MtgCard';

const { TabPane } = Tabs;

function Collection(props) {
  const [viewMode, setViewMode] = useState('list');
  const results = (props.searchResults && props.searchResults.value ? props.searchResults.value.payLoad : []);
  const binders = (props.binders && props.binders.value ? props.binders.value.payLoad : []);
  const collection = (props.collection && props.collection.value ? props.collection.value.payLoad : []);

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

  function renderBinders(binders) {
    return (
      binders.map(b => (
        <MtgBinder binder={b} {...props} />
      ))
    );
  }

  function renderCards(cards) {
    return (
      cards.map(c => (
        <MtgCard mtgcard={c} {...props} />
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
      render: id => formatQuantity(cardQuantity(id, collection)),
    },
    {
      title: 'Azioni',
      key: 'action',
      render: (text, record) => (
        <span>
          <CardUpdate 
            card={{info: record, quantity: cardQuantity(record.multiverseid, collection), items: getCollectedItems(record.multiverseid, collection)}} 
            {...props} 
          />
          <Button
            card={{
              info: record,
              quantity: cardQuantity(record.multiverseid, collection),
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

  

  return (
    <Tabs defaultActiveKey="binder" centered>
        <TabPane tab={<span><DatabaseOutlined />Binders</span>} key="binder" >
            <Row justify="center" align="middle">
                {binders.length > 0 && (
                <Col style={{ textAlign: 'center', marginRight: '20px' }}>
                    <b>Sono stati trovati {binders.length} risultati!</b>
                </Col>
                )}    
                <Col>
                <Tooltip title={tooltipTitle}>
                    <Button icon={btnIcon} onClick={toggleView}/>
                </Tooltip>
                </Col>
            </Row>
            <Spin spinning={(props.binders ? props.binders.pending : false)}>
                <Row gutter={16}>
                    {renderBinders(binders)}
                </Row>
            </Spin>
        </TabPane>
        <TabPane tab="Cards" key="cards">
            <Row justify="center" align="middle">
                {collection.length > 0 && (
                <Col style={{ textAlign: 'center', marginRight: '20px' }}>
                    <b>Sono stati trovati {collection.length} risultati!</b>
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
                    loading={(props.searchResults ? props.searchResults.pending : false)}
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
        </TabPane>
    </Tabs>
  );
}

export default ajaxCards(Collection);