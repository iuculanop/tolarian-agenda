import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

/* eslint-disable */
class TableDatePicker extends React.Component {
  constructor(props) {
    super(props);
    let value;
    const minDate = moment();
    const maxDate = moment();
    if (props.context === 'trasversal') {
      minDate.year(this.props.year - 1);
      minDate.month(8);
      minDate.date(1);
      maxDate.year(this.props.year);
      maxDate.month(7);
      maxDate.date(31);
    } else {
      minDate.year(this.props.year - 2);
      minDate.month(8);
      minDate.date(1);
      maxDate.year(this.props.year + 1);
      maxDate.month(11);
      maxDate.date(31);
    }
    if (this.props.defaultValue === "") {
      value = null;
    } else {
      value = moment(props.defaultValue, "DD/MM/YYYY")
    }
    this.state = {
      value,
      minDate,
      maxDate,
    };
  }

  onBlur = () => {
    const dateMoment = this.state.value;
    if (dateMoment && dateMoment !== null) {
      this.props.onUpdate(dateMoment);
    } else {
      this.props.onUpdate('');
    }
  }

  changeValue = (moment) => {
    this.setState({
      value: moment,
    });
    if (moment === null ) {
      this.props.onUpdate('');
    }
  }

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    return (
      <DatePicker
        dateFormat="DD/MM/YYYY"
        placeholderText="Seleziona una data"
        minDate={this.state.minDate}
        maxDate={this.state.maxDate}
        selected={this.state.value}
        onChange={this.changeValue}
        isClearable
        open
        onClose={this.onBlur}
        onBlur={this.onBlur}
      />
    );
  }
}

export default TableDatePicker;
