import React from 'react';
import { Row, Col, Card } from 'antd';
import ReduxCardTransactions from 'containers/fe/ReduxCardTransactions.jsx';
import ReduxWishlist from 'containers/fe/ReduxWishlist.jsx';
import ReduxFriendList from 'containers/fe/ReduxFriendList.jsx';

// import { connect } from 'react-redux';


class MtGDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      err: null,
      xhr: null,
      status: 'loading',
    };
  }

  render() {
    return (
      <div>
        <Row gutter={32}>
          <Col span={16}>
            <ReduxWishlist />
            <Card>
              <p> informazioni da aggiungere qui</p>
            </Card>
          </Col>
          <Col span={8}>
            <ReduxFriendList />
            <ReduxCardTransactions />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MtGDashboard;

/* MtGDashboard.propTypes = {
 *   isLoadingCritical: PropTypes.bool.isRequired,
 * };
 *
 * const mapStateToProps = (state) => ({
 *   isLoadingCritical: state.registriList.loadingCritical,
 * });
 *
 * const ReduxMtGDashboard = connect(
 *   mapStateToProps,
 * )(MtGDashboard);
 *
 * export default ReduxMtGDashboard;*/
