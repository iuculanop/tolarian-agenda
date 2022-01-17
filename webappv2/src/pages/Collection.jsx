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
  ownedCardRowKey,
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
      title: 'Name',
      dataIndex: 'card_name',
      key: 'name',
      render: (text, row) => <Link style={{ color: '#547192' }} to={cardLink(row)}>{text}</Link>,
    },
    {
      title: 'Set',
      dataIndex: 'mtg_set',
      key: 'setName',
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
    },
    {
      title: 'Collection Number',
      dataIndex: 'collection_number',
      key: 'collNumber',
    },
    {
      title: 'Owned(foil)',
      dataIndex: 'quantity',
      render: (qty, row) => `${qty}(${row.foil_quantity})`,
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
                <Row gutter={16} style={{ padding: '16px' }}>
                    {renderBinders(binders)}
                    <Col style={{ display: 'flex' }} key="newBinder" span={3}>
                        <Card
                            hoverable
                            style={{ width: '100%' }}
                            cover={<img style={{ width: '95%', padding: '2px' }} alt="new binder" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiTj7xLlQHvQIUUlgVQB6IUREjV28uBD9Jcw&usqp=CAU" />}
                        >
                            <Card.Meta title="Add new binder" description="" />
                        </Card>
                    </Col>
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
                    rowKey={ownedCardRowKey}
                    loading={(props.collection ? props.collection.pending : false)}
                    size='small'
                    columns={columns}
                    dataSource={collection}
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