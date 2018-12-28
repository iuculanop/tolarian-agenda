import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import { logoutUser } from 'actions/';
import { appHistory } from 'appHistory';

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'didatticiApprovatore',
    };
  }

  menuLink = (item) => {
    switch (item.key) {
      case 'logout':
        this.props.userLogout();
        appHistory.push('/login');
        break;
      case 'search':
        appHistory.push('/search');
        break;
      case 'home':
        appHistory.push('/');
        break;
      default:
        console.log(item.key);
    }
  }

  render() {
    const menuItems = [];
    menuItems.push(
      <Menu.Item key="home">
        <a role="button">
          <Icon type="home" />
          <span className="menu-item-text">Torna alla Home</span>
        </a>
      </Menu.Item>
    );
    menuItems.push(
      <Menu.Item key="search">
        <a role="button">
          <Icon type="search" />
          <span className="menu-item-text">Cerca</span>
        </a>
      </Menu.Item>
    );
    menuItems.push(
      <Menu.Item key="logout">
        <a role="button">
          <Icon type="logout" />
          <span className="menu-item-text">Logout</span>
        </a>
      </Menu.Item>
    );

    return (
      <Menu
        theme="dark"
        mode="inline"
        onClick={this.menuLink}
      >
        {menuItems}
      </Menu>
    );
  }
}

SideMenu.propTypes = {
  user: PropTypes.object,
  userLogout: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.userInfo.data,
});

const mapDispatchToProps = (dispatch) => ({
  userLogout: () => dispatch(logoutUser()),
});

const ReduxSideMenu = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(SideMenu);

export default ReduxSideMenu;

