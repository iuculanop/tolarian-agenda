import React, { PropTypes } from 'react';

class TableInputTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.selected || props.defaultValue || '',
    };
  }

  componentWillMount() {
    this.setState({
      data: this.props.defaultValue,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.value,
    });
  }

  setRef = (ref) => { this.formaDidEditor = ref; }

  handleChange = (ev) => {
    this.setState({
      data: ev.target.value,
    });
  }

  handleBlur = (ev) => {
    this.setState({
      data: ev.target.value,
    });
    this.props.onUpdate(ev.target.value);
  }

  focus() {
    this.formaDidEditor.focus();
  }

  render() {
    // const selected = this.props.selected || '';
    // const selectedInt = parseInt(this.props.selected, 10);
    return (
      <span className="full-width">
        <textarea
          ref={this.setRef}
          name={this.props.name}
          className={this.props.inputStyle || 'full-width onlyvert'}
          rows="5"
          value={this.state.data}
          onChange={(ev) => { this.handleChange(ev); }}
          onBlur={(ev) => { this.handleBlur(ev); }}
        />
      </span>
    );
  }
}

TableInputTextArea.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  noDefault: PropTypes.bool,
  name: PropTypes.string,
  inputStyle: PropTypes.string,
  selected: PropTypes.string,
};

export default TableInputTextArea;

