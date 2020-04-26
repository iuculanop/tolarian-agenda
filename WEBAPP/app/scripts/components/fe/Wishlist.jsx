import React, { PropTypes } from 'react';
import { Card, Table } from 'antd';
import { wishlistCardLink } from 'util/NavigationUtils.jsx';
import { isFoilFormatter, cardNameFormatter } from 'util/CardCollection.jsx';

const columns = [
  {
    title: 'Carta',
    dataIndex: 'name',
    key: 'name',
    onCellClick: wishlistCardLink,
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
    title: 'Quantità',
    dataIndex: 'quantity',
    key: 'qty',
  },
];

class Wishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.fetchWishlist();
  }

  render() {
    return (
      <Card style={{ marginBottom: '10px' }} loading={this.props.isLoading} title="Lista Desideri">
        <Table
          size="small"
          pagination={false}
          rowKey="rowId"
          columns={columns}
          dataSource={this.props.wishlist}
        />
      </Card>
    );
  }
}

Wishlist.propTypes = {
  isLoading: PropTypes.bool,
  wishlist: PropTypes.arrayOf(PropTypes.object),
  fetchWishlist: PropTypes.func.isRequired,
};

export default Wishlist;
