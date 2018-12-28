import React, { Component } from 'react';

import { ToastContainer, ToastMessage } from 'react-toastr';


const ToastrMessageFactory = React.createFactory(ToastMessage.animation);

class Notification extends Component {
  // allow type is success,info,warning,error
  notice(type, msg, title) {
    this.refs.toastr[type](
      msg, title, {
        timeOut: 3000,
        extendedTimeOut: 1000,
        showAnimation: 'animated fadeIn',
        hideAnimation: 'animated fadeOut',
      });
  }

  render() {
    return (
      <ToastContainer
        ref="toastr"
        toastMessageFactory={ToastrMessageFactory}
        id="toast-container"
        className="toast-top-center"
      />
    );
  }
}

export default Notification;
