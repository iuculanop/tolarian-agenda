import React, { PropTypes } from 'react';
import { Card, Tabs, Table } from 'antd';
import _ from 'lodash';
import { DateQuery } from 'util/DateFormatter.jsx';
import { transactionCardLink } from 'util/NavigationUtils.jsx';

const Panel = Tabs.TabPane;

const columns = [
  {
    title: 'Carta',
    dataIndex: 'cardInfo.name',
    key: 'name',
    onCellClick: transactionCardLink,
    render: text => <a>{text}</a>,
  },
  {
    title: 'Data',
    dataIndex: 'trans_date',
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
      <Card loading={this.props.isLoading}>
        <Tabs defaultActiveKey="1">
          <Panel tab="Aggiunte" key="1">
            <Table
              size="small"
              pagination={false}
              rowKey="r_id"
              columns={columns}
              dataSource={_.filter(this.props.transactions, ['trans_type', 'add'])}
            />
          </Panel>
          <Panel tab="Rimosse" key="2">
            <Table
              size="small"
              pagination={false}
              rowKey="r_id"
              columns={columns}
              dataSource={_.filter(this.props.transactions, ['trans_type', 'remove'])}
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
