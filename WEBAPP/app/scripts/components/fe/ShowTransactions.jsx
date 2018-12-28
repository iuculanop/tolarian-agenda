import React, { PropTypes } from 'react';
import { Card, Tabs, Icon } from 'antd';

const TabPane = Tabs.TabPane;

class MtGTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  render() {
    return (
      <Card>
        <Tabs defaultActiveKey="2">
          <TabPane tab={<span><Icon type="down-square" />Tab 1</span>} key="1">
            Tab 1
          </TabPane>
          <TabPane tab={<span><Icon type="up-square" />Tab 2</span>} key="2">
            Tab 2
          </TabPane>
        </Tabs>
        <p> ultime transazioni qui.</p>
      </Card>
    );
  }
}

MtGTransactions.propTypes = {
  user: PropTypes.object.isRequired,
  onFetchTransactions: PropTypes.func.isRequired,
};

export default MtGTransactions;
