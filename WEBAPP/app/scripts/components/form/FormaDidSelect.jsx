import React, { PropTypes } from 'react';

class FormaDidSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected || props.defaultValue || '',
    };
  }

  componentWillMount() {
    if (this.props.formeDid.length === 1) {
      this.setState({
        selected: this.props.formeDid[0].idFormaDidattica,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.formeDid.length === 1) {
      this.setState({
        selected: nextProps.formeDid[0].idFormaDidattica.toString(),
      });
    }
  }

  setRef = (ref) => { this.formaDidEditor = ref; }

  changeSelection = (ev) => {
    this.setState({
      selected: ev.target.value,
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
      <span>
        <select
          ref={this.setRef}
          name={this.props.name}
          className={this.props.inputStyle}
          value={this.state.selected}
          onChange={(ev) => { this.changeSelection(ev); }}
          onBlur={(ev) => { this.changeSelection(ev); }}
        >
          {
            this.props.formeDid.length > 1 && !this.props.noDefault &&
              <option value="">Seleziona</option>
          }
          {this.props.formeDid.map(formaDid =>
            (<option key={formaDid.idFormaDidattica} value={formaDid.idFormaDidattica}>
              {formaDid.descrizione}
            </option>))
          }
        </select>
      </span>
    );
  }
}

FormaDidSelect.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  defaultValue: PropTypes.number,
  formeDid: PropTypes.arrayOf(PropTypes.object).isRequired,
  noDefault: PropTypes.bool,
  name: PropTypes.string,
  inputStyle: PropTypes.string,
  selected: PropTypes.string,
};

export default FormaDidSelect;

