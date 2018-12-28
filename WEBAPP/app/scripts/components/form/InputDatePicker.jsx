import React from 'react';
import { HOC } from 'formsy-react';
import DatePicker from 'react-datepicker';
// import Notification from 'components/generic/Notification.jsx';

import moment from 'moment';

/* eslint-disable */
class InputDatePicker extends React.Component {
  constructor(props) {
    super(props);
    const minDate = moment();
    const maxDate = moment();
    if (props.context === 'trasversal') {
      minDate.year(this.props.year - 1);
      minDate.month(9);
      minDate.date(1);
      maxDate.year(this.props.year);
      maxDate.month(8);
      maxDate.date(30);
    } else {
      minDate.year(this.props.year - 2);
      minDate.month(8);
      minDate.date(1);
      maxDate.year(this.props.year + 1);
      maxDate.month(11);
      maxDate.date(31);
    }
    this.state = {
      actualDate: null,
      minDate,
      maxDate,
    };
  }

  changeValue = (date) => {
    this.setState({
      actualDate: date,
    });
    this.props.setValue(date);
  }

  componentWillMount() {
    this.props.setValue(this.state.actualDate);
  }

  render() {
    let className = this.props.size || 'col-sm-3';
    let req = null;
    if (this.props.isRequired()) {
      className = className + ' required';
      req = '*';
    } else if (this.props.showError()) {
      className = className + ' error';
    }

    const errorMsg = this.props.getErrorMessage();

    return (
      <div className={className}>
        <label className="highlight" htmlFor={this.props.name}>
          {this.props.title}{req}
        </label>
        <DatePicker
          dateFormat="DD/MM/YYYY"
          selected={this.state.actualDate}
          minDate={this.state.minDate}
          maxDate={this.state.maxDate}
          onChange={this.changeValue}
          className="inputStyle"
        />
      </div>
    );
  }
}

export default HOC(InputDatePicker);
