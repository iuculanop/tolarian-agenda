import React, { PropTypes } from 'react';
import { Card, Tabs, Table } from 'antd';
import _ from 'lodash';
import { DateQuery } from 'util/DateFormatter.jsx';
import { isFoilFormatter, cardNameFormatter } from 'util/CardCollection.jsx';
import { transactionCardLink } from 'util/NavigationUtils.jsx';

const Panel = Tabs.TabPane;

const columns = [
  {
    title: 'Carta',
    dataIndex: 'name',
    key: 'name',
    onCellClick: transactionCardLink,
    render: (text, row) => cardNameFormatter(row),
  },
  {
    title: 'Foil',
    dataIndex: 'cardType',
    key: 'isFoil',
    render: isFoil => isFoilFormatter(isFoil),
  },
  {
    title: 'Set',
    dataIndex: 'cardSet',
    key: 'set',
  },
  {
    title: 'Data',
    dataIndex: 'transDate',
    key: 'dateTransaction',
    render: date => DateQuery.formatEU(DateQuery.parse(date)),
  },
];

class CardTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.fetchTransactions();
  }

  render() {
    return (
      <Card
        style={{ marginBottom: '10px' }}
        loading={this.props.isLoading}
        title="Ultime Transazioni"
      >
        <Tabs defaultActiveKey="1">
          <Panel tab="Aggiunte" key="1">
            <Table
              size="small"
              pagination={false}
              rowKey="rowId"
              columns={columns}
              dataSource={_.filter(this.props.transactions, ['transType', 'add'])}
            />
          </Panel>
          <Panel tab="Rimosse" key="2">
            <Table
              size="small"
              pagination={false}
              rowKey="rowId"
              columns={columns}
              dataSource={_.filter(this.props.transactions, ['transType', 'remove'])}
            />
          </Panel>
        </Tabs>
      </Card>
    );
  }
}

CardTransactions.propTypes = {
  isLoading: PropTypes.bool,
  transactions: PropTypes.arrayOf(PropTypes.object),
  fetchTransactions: PropTypes.func.isRequired,
};

export default CardTransactions;
