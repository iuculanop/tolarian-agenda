import React, { PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { stateToIconFormatter,
         nameFormatter,
         formaDidatticaFormatter,
         infoFormatter,
         oreSommateFormatter } from 'util/Formatters.jsx';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';
import ReduxAcademicYears from 'containers/fe/ReduxAcademicYears.jsx';
import { appHistory } from 'appHistory';
import { getActualAcademicYear } from 'util/AcademicYears.jsx';
import Notification from 'components/generic/Notification.jsx';

const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };
// const appHistory = browserHistory;

class RegistriList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calledWs: false,
    };
  }

  componentDidMount() {
    // getting the actual year's Educational Records
    this.props.onReceivingEduRecords(this.props.actualYear);
    // getting the critical Educational Records
    this.props.onCheckingEduRecords(getActualAcademicYear());

    // fix for wrong table header columns bug of react-bootstrap-table
    window.setTimeout(() => this.refs.registri.forceUpdate(), 0);
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

  /* eslint-disable */
  onButtonClick = () => {
    const trasversalRec = this.props.registriTrasv[0];
    const year = this.props.actualYear.substring(this.props.actualYear.length - 4);
    // controllo se l'id registro è presente, se lo è ridirigo alla pagina di
    // dettaglio, altrimenti invoco il ws di vincenzo
    if (!trasversalRec || trasversalRec.daCreare) {
      this.setState({
        calledWs: true,
      });
      // invoco action di creazione registro trasversale
      this.props.openingTrasRecord(year)
          .then((response) => {
            this.setState({
              calledWs: false,
            });
            appHistory.push(`/attivita/${response.payload[0].idRegistro}/`);
          },
                (response) => {
                  this.Notification.notice(
                    'error',
                    response.errors.message,
                    'Operazione fallita'
                    );
                  // alert(response);
                  this.setState({
                    calledWs: false,
                  });
                });
    } else {
      appHistory.push(`/attivita/${trasversalRec.idRegistro}/`);
    }
  }

  setNotificationRef = (ref) => { this.Notification = ref;}

  render() {
    let tooltipTrasversal = 'Clicca per aprire il registro trasversale.';
    let status = (
      <span title="Da aprire">
        <i className="fa fa-key fa-lg"></i>
      </span>);
    if (this.props.registriTrasv.length !== 0) {
      status = stateToIconFormatter(this.props.registriTrasv[0].stato);
    }
    /* const isDisabled = isOnAcademicYear();
     * if (isDisabled) {
     *   tooltipTrasversal =
     *     'Sarà possibile aprire il registro trasversale dal 1 ottobre dell\'anno corrente.';
     * }*/
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="box box-solid box-unimi">
            <div className="box-header">
              <h3 className="box-title">
                Anno Accademico {this.props.actualYear}
              </h3>
              <ReduxAcademicYears />
            </div>
            <div className="box-body">
              <div className="row no-margin">
                <div className="col-md-8">
                  <h3>
                    Registri Didattici
                  </h3>
                </div>
                <div className="col-md-4 pull-right valign">
                  <div className="btn-group btn-group-bordered pull-right">
                    <button
                      title={tooltipTrasversal}
                      className="btn btn-default"
                    >
                      {status}
                    </button>
                    <button
                      title={tooltipTrasversal}
                      className="btn btn-primary"
                      onClick={this.onButtonClick}
                    >
                      <span className="mg2">Registro altre attività</span>
                    </button>
                  </div>
                  <div className="float-right">
                    <span><b>Il registro delle altre attivita non deve essere compilato dai professori a contratto</b></span>
                  </div>
                </div>
              </div>
              <Loader
                show={this.props.loading}
                message={<Spinner />}
                backgroundStyle={backStyle}
              >
                <Loader
                  show={this.state.calledWs}
                  message={<Spinner />}
                  backgroundStyle={backStyle}
                >
                  <BootstrapTable
                    tableBodyClass="tabregistri"
                    ref="registri"
                    data={this.props.registri}
                    options={{ onRowClick: this.onRowClick,
                    noDataText: 'Non sono presenti registri per l\'anno selezionato' }}
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
                      dataField="descAF"
                      width="200"
                      dataFormat={nameFormatter}
                    >Attivita Formativa (AF)
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="descFD"
                      dataFormat={formaDidatticaFormatter}
                      width="200"
                    >Forma Didattica
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="descCopertura"
                      dataAlign="center"
                    >Modalità Copertura
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
                  <Notification ref={this.setNotificationRef} />
                </Loader>
              </Loader>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

RegistriList.propTypes = {
  actualYear: PropTypes.string.isRequired,
  registri: PropTypes.arrayOf(PropTypes.object).isRequired,
  registriTrasv: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool.isRequired,
  onReceivingEduRecords: PropTypes.func.isRequired,
  onCheckingEduRecords: PropTypes.func.isRequired,
  openingEduRecord: PropTypes.func,
  openingTrasRecord: PropTypes.func,
};

export { RegistriList };
