import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { appHistory } from 'appHistory';
import { fetchUser } from 'actions/';
import Profile from 'components/fe/HeaderProfile.jsx';
import SideMenu from 'components/fe/SideMenu.jsx';
import { Layout, Menu } from 'antd';
// import ReduxAuthAlert from 'containers/fe/ReduxAuthAlert.jsx';
// import ReduxErrorAlert from 'containers/fe/ReduxErrorAlert.jsx';
// import { casURL, baseURL, logoutURL } from 'util/AppConfig.jsx';
// import { decodeText } from 'util/EncodeUtils.jsx';
const { Header, Content, Footer, Sider } = Layout;

// const authURL = casURL + baseURL;
class FrontendApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  componentDidMount() {
    if (!this.props.isLoaded || this.props.location.pathname !== '/login') {
      this.props.fetchUserInfo()
          .then(() => {
            const newhref = appHistory.createHref(appHistory.getCurrentLocation());
            window.history.replaceState({}, '', newhref);
          })
          .catch((error) => {
            if (error.error) {
              appHistory.push('/login');
            }
          }
          );
    } else {
      if (this.props.user.error) {
        appHistory.push('/login');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      console.log('debug frontendApp nextProps=', nextProps);
      if (nextProps.location.pathname !== '/login') {
        nextProps.fetchUserInfo()
               .then(() => {
                 const newhref = appHistory.createHref(appHistory.getCurrentLocation());
                 window.history.replaceState({}, '', newhref);
               })
               .catch((error) => {
                 if (error.error) {
                   appHistory.push('/login');
                 }
               }
               );
      }
    }
  }

  toggle = (collapsed) => {
    this.setState({
      collapsed,
    });
  }

  renderChildren = () => (this.props.children)

  render() {
    return (
      <Layout className="layout" style={{ background: '#ecf0f5', minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          className="left-sider"
          onCollapse={this.toggle}
          width="280"
        >
          <div className="wrapper-logo">
            <div className="logo" />
          </div>
          <SideMenu />
        </Sider>
        <Layout>
          <Header
            style={{ background: '#036',
                     width: '100%',
                     height: '80px',
                     padding: 0,
            }}
          >
            <Menu
              theme="blue"
              mode="horizontal"
              style={{ lineHeight: '64px' }}
              selectable={false}
            >
              <Menu.Item>
                <Profile user={this.props.user} />
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="unimi-content-body">
            <div>{this.renderChildren()}</div>
          </Content>
          <Footer className="unimi-footer">
            <b>Copyright ©2017 Gruppo Sviluppo,
              Div. Sistemi Informativi UniMI
            </b> - Tutti i diritti riservati.
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

FrontendApp.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object,
  isLoaded: PropTypes.bool,
  fetchUserInfo: PropTypes.func,
  location: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.userInfo.data,
  isLoaded: state.userInfo.isLoaded,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUserInfo: () => dispatch(fetchUser()),
});

const ReduxFrontendApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontendApp);

export default ReduxFrontendApp;

