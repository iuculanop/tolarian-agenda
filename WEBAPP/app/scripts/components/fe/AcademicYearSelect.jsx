import React, { PropTypes } from 'react';
import { generateRange } from 'util/AcademicYears.jsx';

const optionRange = generateRange().map((v, i) => <option key={i} value={v}>{v} </option>);

class AcademicYearSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '2016/2017',
    };
  }

  render() {
    return (
      <div className="pull-right black-text">
        <label className="white-text mg5"> Seleziona anno accademico: </label>
        <select onChange={this.props.onChangeYear} value={this.props.actualYear}>
          {optionRange}
        </select>
      </div>
    );
  }

}

AcademicYearSelect.propTypes = {
  onChangeYear: PropTypes.func.isRequired,
  actualYear: PropTypes.string.isRequired,
};

export { AcademicYearSelect };
