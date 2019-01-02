import React, { PropTypes } from 'react';
import { Popover, Avatar } from 'antd';

function HeaderProfile({ user }) {
  if (user.id_name) {
    let welcome = `${user.name} ${user.surname}`;
    return (
      <Popover
        placement="bottom"
        title={welcome}
        content="add account info here"
        trigger="click"
      >
        <Avatar>
          {welcome}
        </Avatar>
      </Popover>
    );
  }
  return (
    <Avatar icon="user" />
  );
}

HeaderProfile.propTypes = {
  user: PropTypes.object,
};

export default HeaderProfile;
