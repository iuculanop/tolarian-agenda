import React, { PropTypes } from 'react';
import { Card, Table } from 'antd';
import { friendLink } from 'util/NavigationUtils.jsx';

const columns = [
  {
    title: 'Username',
    dataIndex: 'idName',
    key: 'idName',
    onCellClick: friendLink,
    render: text => <a>{text}</a>,
  },
  {
    title: 'Nome',
    dataIndex: 'name',
    key: 'isFoil',
  },
  {
    title: 'Cognome',
    dataIndex: 'surname',
    key: 'set',
  },
];

class FriendList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    return (
      <Card style={{ marginBottom: '10px' }} loading={this.props.isLoading} title="Lista Amici">
        <Table
          size="small"
          pagination={false}
          rowKey="id"
          columns={columns}
          dataSource={this.props.friendList}
        />
      </Card>
    );
  }
}

FriendList.propTypes = {
  isLoading: PropTypes.bool,
  friendList: PropTypes.arrayOf(PropTypes.object),
};

export default FriendList;
