import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { stateToIconFormatter,
         nameFormatter,
         formaDidatticaFormatter,
         infoFormatter,
         oreSommateFormatter,
         academicYearFormatter } from 'util/Formatters.jsx';
import { appHistory } from 'appHistory';

class CriticalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calledWs: false,
    };
  }

  componentDidMount() {
    // fix for wrong table header columns bug of react-bootstrap-table
    window.setTimeout(() => this.refs.critRegistri.forceUpdate(), 0);
  }

  onRowClick = (row) => {
    // controllo se l'id registro è presente, se lo è ridirigo alla pagina di
    // dettaglio, altrimenti invoco il ws di vincenzo
    if (!row.idRegistro) {
      this.setState({
        calledWs: true,
      });
      this.props.openingEduRecord(row.idCopertura)
          .then((response) => {
            this.setState({
              calledWs: false,
            });
            appHistory.push(`registro/${response.payload.idRegistro}/`);
          });
    } else {
      appHistory.push(`registro/${row.idRegistro}/`);
    }
  }

  render() {
    if (this.props.registriCritical && this.props.registriCritical.length > 0) {
      return (
        <div className="row">
          <div className="col-md-12">
            <div className="box box-solid box-danger collapsed-box">
              <div className="box-header">
                <h3 className="box-title">
                  <i className="glyphicon glyphicon-alert"></i>
                  <span className="mg10">
                    Registri incompleti negli anni precedenti
                  </span>
                </h3>
                <div className="box-tools pull-right">
                  <button className="btn btn-box-tool" data-widget="collapse">
                    <i className="fa fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <div className="box-body">
                <BootstrapTable
                  tableBodyClass="tabregistri"
                  ref="critRegistri"
                  data={this.props.registriCritical}
                  options={{ onRowClick: this.onRowClick }}
                  striped
                  hover
                >
                  <TableHeaderColumn
                    dataField="idCopertura"
                    isKey
                    hidden
                  >Id copertura
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="stato"
                    dataAlign="center"
                    width="60"
                    dataFormat={stateToIconFormatter}
                  >Stato
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="annoAccademico"
                    dataAlign="center"
                    width="90"
                    dataFormat={academicYearFormatter}
                  >Anno Acc.
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="descAF"
                    width="180"
                    dataFormat={nameFormatter}
                  >Attivita Formativa (AF)
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="descFD"
                    dataFormat={formaDidatticaFormatter}
                  >Forma Didattica
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="descCopertura"
                    dataAlign="center"
                  >Mod.Copertura
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="codAF"
                    dataFormat={infoFormatter}
                  >Altre informazioni
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="totaliAssegnate"
                    dataAlign="center"
                    dataFormat={oreSommateFormatter}
                  >Ore Registrate/Assegnate
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (<div></div>);
  }
}

CriticalList.propTypes = {
  registriCritical: PropTypes.arrayOf(PropTypes.object).isRequired,
  openingEduRecord: PropTypes.func,
};

export { CriticalList };
