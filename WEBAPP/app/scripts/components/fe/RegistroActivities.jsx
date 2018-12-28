import React, { PropTypes } from 'react';

import RegistroIntro from 'components/fe/RegistroIntro.jsx';
import RegistroAlert from 'components/fe/RegistroAlert.jsx';
import ModalWeeklySchedule from 'components/modal/ModalWeeklySchedule.jsx';
import ModalSingleSchedule from 'components/modal/ModalSingleSchedule.jsx';
import DeleteButton from 'components/modal/ModalConfirmDelete.jsx';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { editFormatter, argumentFormatter } from 'util/Formatters.jsx';
import { sortDate } from 'util/Sorting.jsx';
import { aoObjectOf } from 'util/ArrayUtils.jsx';
import _ from 'lodash';
import Notification from 'components/generic/Notification.jsx';
import { durationValidator, formaDidValidator } from 'util/Validators.jsx';
import TableDatePicker from 'components/form/TableDatePicker.jsx';
import TableTimePicker from 'components/form/TableTimePicker.jsx';
import FormaDidSelect from 'components/form/FormaDidSelect.jsx';
import InputFloat from 'components/form/InputFloat.jsx';
import TableInputTextArea from 'components/form/TableInputTextArea.jsx';

function checkModified(obj, property, value) {
  if (obj[property].toString() === value) {
    return false;
  }
  return true;
}

const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };

const createFormaDidEditor = (onUpdate, props) =>
  (<FormaDidSelect onUpdate={onUpdate} noDefault {...props} />);

const createDurationEditor = (onUpdate, props) =>
  (<InputFloat onUpdate={onUpdate} {...props} />);

const createDayEditor = (onUpdate, props) =>
  (<TableDatePicker onUpdate={onUpdate} {...props} />);

const createTimeEditor = (onUpdate, props) =>
  (<TableTimePicker onUpdate={onUpdate} {...props} />);

const createArgumentEditor = (onUpdate, props) =>
  (<TableInputTextArea onUpdate={onUpdate} {...props} />);

class RegistroActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      argWidth: '300',
    };
  }

  setNotificationRef = (ref) => { this.Notification = ref; }

  setFullWidth = () => {
    this.setState({
      argWidth: '600',
    });
  }

  setMinWidth = () => {
    this.setState({
      argWidth: '300',
    });
  }

  handleWidthChange = () => {
    if (this.state.argWidth === '300') {
      this.setFullWidth();
    } else {
      this.setMinWidth();
    }
  }

  updateRow = (row, cellName, cellValue) => {
    const occurrences = [];
    let retVal;
    console.log(retVal);
    if (checkModified(row, cellName, cellValue)) {
      const updatedRow = _.cloneDeep(row);
      updatedRow[cellName] = cellValue;
      occurrences.push(updatedRow);
      retVal = this.props.updateOccurrences(this.props.registryInfo.idRegistro, occurrences)
                   .then((response) => {
                     if (response.error) {
                       this.Notification.notice(
                       'error',
                       'Operazione fallita',
                       'Salvataggio non effettuato');
                       return false;
                     }
                     this.Notification.notice(
                       'success',
                       'Informazioni salvate',
                       'Salvataggio effettuato');
                     return true;
                   });
    }
    return true;
  }

  formaDidFormatter = (cell) => {
    if (cell === '') {
      return (
        <span>
          <i className="glyphicon glyphicon-pencil"></i>
        </span>
      );
    }
    const formaDid = aoObjectOf(
        this.props.registryInfo.descFD,
        parseInt(cell, 10),
      'idFormaDidattica');
    return `<span>${formaDid.descrizione}</span><span class='float-right vcenter trasp'>
<i class='glyphicon glyphicon-pencil'></i></span>`;
  }

  actionFormatter = (cell) => {
    const occurrence = aoObjectOf(this.props.registryOccurrences, cell, 'rId');
    return (
      <DeleteButton
        idRegistro={this.props.registryInfo.idRegistro}
        objToDelete={occurrence}
        deleteFunction={this.props.deleteOccurrences}
        notifier={this.Notification}
      />
    );
  }

  roomValidator = (value) => {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Si prega di inserire l\'aula';
      response.notification.title = 'Campo obbligatorio';
      this.Notification.notice(response.notification.type,
                               response.notification.msg,
                               response.notification.title);
    }
    return response;
  }

  render() {
    const occurrences = this.props.registryOccurrences;
    const editRowProp = {
      mode: 'click',
      blurToSave: true,
      beforeSaveCell: (row, cellName, cellValue) => (this.updateRow(row, cellName, cellValue)),
    };

    const isCondensed = occurrences.length > 12 && this.props.isLoaded;
    let height = '';
    if (isCondensed) {
      height = '450px';
    }

    const expandBtnTitle =
      (this.state.argWidth === '300' ? 'Espandi Argomento' : 'Riduci Argomento');

    switch (this.props.registryInfo.stato) {
      case 'C':
      case 'A':
      case 'Z':
        return (
          <div className="box box-solid box-unimi">
            <div className="box-header">
              <h3 className="box-title">
                Elenco Attività Registro
              </h3>
            </div>
            <div className="box-body">
              <BootstrapTable
                data={occurrences}
                height={height}
                condensed={isCondensed}
                striped
              >
                <TableHeaderColumn dataField="rId" hidden isKey>Id</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="day"
                  width="90"
                  dataSort
                  sortFunc={sortDate}
                >Data</TableHeaderColumn>
                <TableHeaderColumn dataField="time" width="90">Ora di inizio</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="durata"
                  width="60"
                  dataAlign="center"
                >Durata</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="argomento"
                  width="350"
                  columnClassName="multiline"
                >Argomento</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="aula"
                  width="120"
                  columnClassName="multiline"
                >Aula</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="sede"
                  width="150"
                  columnClassName="multiline"
                >Sede</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="descFormaDid"
                  width="150"
                >Forma Didattica</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
        );
      case 'N':
      default:
        return (
          <div className="box box-solid box-unimi">
            <div className="box-header">
              <h3 className="box-title">
                Elenco Attività Registro
              </h3>
            </div>
            <div className="box-body">
              <RegistroAlert
                registryInfo={this.props.registryInfo}
              />
              {
                this.props.isLoaded && occurrences.length > 0 &&
                  <Loader
                    show={this.props.isEditing}
                    message={<Spinner />}
                    backgroundStyle={backStyle}
                  >
                    <div className="row">
                      <div className="col-sm-10">
                        <p>
                          Attività attualmente inserite nel registro. <br />
                          Le attività vengono salvate automaticamente dopo ogni modifica.
                        </p>
                      </div>
                      <div className="col-sm-2">
                        <button
                          type="button"
                          className="btn btn-primary float-right"
                          onClick={this.handleWidthChange}
                        >
                        {expandBtnTitle}
                        </button>
                      </div>
                    </div>
                    <BootstrapTable
                      data={occurrences}
                      cellEdit={editRowProp}
                      striped
                      hover
                      height={height}
                      condensed={isCondensed}
                    >
                      <TableHeaderColumn
                        dataField="rId"
                        width="40"
                        isKey
                        dataFormat={this.actionFormatter}
                      />
                      <TableHeaderColumn
                        dataField="day"
                        width="100"
                        columnClassName="td-edit-enabled multiline"
                        dataFormat={editFormatter}
                        customEditor={{
                          getElement: createDayEditor,
                          customEditorParameters: {
                            year: this.props.registryInfo.annoAccademico,
                          },
                        }}
                        dataSort
                        sortFunc={sortDate}
                      >Data</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="time"
                        width="85"
                        columnClassName="td-edit-enabled multiline"
                        dataFormat={editFormatter}
                        customEditor={{
                          getElement: createTimeEditor,
                        }}
                      >Ora inizio</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="durata"
                        editable={{ validator: durationValidator }}
                        dataFormat={editFormatter}
                        columnClassName="td-edit-enabled multiline"
                        customEditor={{
                          getElement: createDurationEditor,
                        }}
                        width="90"
                      >Durata</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="argomento"
                        dataFormat={argumentFormatter}
                        width={this.state.argWidth}
                        columnClassName="td-edit-enabled multiline"
                        customEditor={{
                          getElement: createArgumentEditor,
                          customEditorParameters: {
                            name: 'argomento',
                          },
                        }}
                      >Argomento</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="aula"
                        width="120"
                        editable={{ validator: this.roomValidator }}
                        dataFormat={editFormatter}
                        columnClassName="td-edit-enabled multiline"
                      >Aula</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="sede"
                        width="150"
                        editable={{ validator: this.roomValidator }}
                        dataFormat={editFormatter}
                        columnClassName="td-edit-enabled multiline"
                      >Sede</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="idFormaDid"
                        width="180"
                        dataFormat={this.formaDidFormatter}
                        columnClassName="td-edit-enabled multiline"
                        editable={{ validator: formaDidValidator }}
                        customEditor={{
                          getElement: createFormaDidEditor,
                          customEditorParameters: {
                            formeDid: this.props.registryInfo.descFD,
                          },
                        }}
                      >Forma Didattica</TableHeaderColumn>
                    </BootstrapTable>
                    <ModalSingleSchedule
                      registryId={this.props.registryInfo.idRegistro}
                      registryYear={this.props.registryInfo.annoAccademico}
                      formeDidScheduled={this.props.registryInfo.descFD}
                      onSaveClick={this.props.onInsertByWeek}
                    />
                  </Loader>
              }
              <Notification ref={this.setNotificationRef} />
              {
              occurrences.length === 0 && this.props.isLoaded &&
                <div>
                  <RegistroIntro
                    weeklyButton={
                      <ModalWeeklySchedule
                        registryId={this.props.registryInfo.idRegistro}
                        registryYear={this.props.registryInfo.annoAccademico}
                        formeDidScheduled={this.props.registryInfo.descFD}
                        onSaveClick={this.props.onInsertByWeek}
                      />
                                 }
                    singleButton={
                      <ModalSingleSchedule
                        registryId={this.props.registryInfo.idRegistro}
                        registryYear={this.props.registryInfo.annoAccademico}
                        formeDidScheduled={this.props.registryInfo.descFD}
                        onSaveClick={this.props.onInsertByWeek}
                      />
                                 }
                  />
                </div>
              }
            </div>
          </div>
        );
    }
  }
}

RegistroActivities.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onInsertByWeek: PropTypes.func.isRequired,
  deleteOccurrences: PropTypes.func.isRequired,
  updateOccurrences: PropTypes.func.isRequired,
};

export { RegistroActivities };
