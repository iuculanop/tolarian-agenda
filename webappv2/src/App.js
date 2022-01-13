import { useState, useContext, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu, Divider, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, DashboardOutlined, LaptopOutlined, NotificationOutlined, BookOutlined } from '@ant-design/icons';
import { MeContext } from './context';
import ajaxMe from './ajax/me';
import { basepath } from './AppConfig';
import './App.less';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Faq from './pages/Faq';
import Search from './pages/Card/SearchList';
import { Footer } from 'antd/lib/layout/layout';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function App(props) {
  const [collapsed, setCollapsed] = useState(true);
  const [auth, setAuth] = useState(false);
  const me = props.me;

  function onCollapse() {
    setCollapsed(!collapsed);
  }

  useEffect(function() {
    // console.warn('me di merda', me);
    if (me && me.value != null) {
      // console.warn('changed!');
      setAuth(true);
    }
  }, [me]);

  return (
    <Layout style={{ heigth: '100vh' }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <Menu.Item key="search" icon={<SearchOutlined />}>
            Cerca
            <Link to="/search" />
          </Menu.Item>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
            <Link to="/dashboard" />
          </Menu.Item>
          <Menu.Item key="collection" icon={<BookOutlined />}>
            Collection
            <Link to="/collection" />
          </Menu.Item>
          <Menu.Item className="no-active" key="user">
            <Avatar size="small" icon={<UserOutlined />}/>
            <Link to="/login" />
          </Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<SearchOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content
            className="content-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: '90vh'
            }}
          >
            <Routes basename={basepath}>
              <Route path="search" element={<Search />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="login" element={<Login />} />
              <Route path="faq" element={<Faq />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
            </Routes>
          </Content>
          <Footer>
            <b>Copyright ©2019 El Mariachi Studios
            </b> - Tutti i diritti riservati.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default ajaxMe(App);
