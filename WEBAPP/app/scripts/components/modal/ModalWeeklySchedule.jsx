import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import { SideNav } from 'react-sidenav';
import DatePicker from 'react-datepicker';
import InputFloat from 'components/form/InputFloat.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormaDidSelect from 'components/form/FormaDidSelect.jsx';
import SingleOccurrenceForm from 'components/form/SingleOccurrenceForm.jsx';

import _ from 'lodash';
import moment from 'moment';
import { generateDateFromUser } from 'util/DateGenerator.jsx';
import { aoIndexOf, aoObjectOf } from 'util/ArrayUtils.jsx';
import { durationValidator } from 'util/Validators.jsx';
import Loader from 'react-loader-advanced';

const customStyles = {
  content: {
    position: 'absolute',
    bottom: '20px',
    left: '70px',
    right: '40px',
    top: 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    padding: '20px',
  },
  overlay: {
    zIndex: '1050',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const rightStyle = {
  color: '#333333 !important',
};

const createFormaDidEditor = (onUpdate, props) =>
  (<FormaDidSelect onUpdate={onUpdate} {...props} />);

const createDurationEditor = (onUpdate, props) =>
  (<InputFloat onUpdate={onUpdate} {...props} />);

const backStyle = { backgroundColor: 'rgba(255, 255, 255, 1)' };
const frontStyle = { color: 'black', fontSize: '16' };

function hourStartValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);
  if (!isValid) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'il formato deve essere hh:mm.(es. 09:00)';
    response.notification.title = 'Valore non ammissibile';
  }
  return response;
}

function roomValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Si prega di inserire l\'aula';
    response.notification.title = 'Campo obbligatorio';
  }
  return response;
}
function occurrencesCounter(weeklyOccurrences) {
  const counter = weeklyOccurrences.monday.length +
                  weeklyOccurrences.tuesday.length +
                  weeklyOccurrences.wednesday.length +
                  weeklyOccurrences.thursday.length +
                  weeklyOccurrences.friday.length +
                  weeklyOccurrences.saturday.length;
  return counter;
}

function occurrencesChecker(dayOccurrences) {
  for (let i = 0; i < dayOccurrences.length; i++) {
    if (dayOccurrences[i].rowId === 0) {
      return false;
    }
    if (dayOccurrences[i].hourStart === '') {
      return false;
    }
    if (dayOccurrences[i].duration === '') {
      return false;
    }
    if (dayOccurrences[i].room === '') {
      return false;
    }
    if (dayOccurrences[i].place === '') {
      return false;
    }
    if (dayOccurrences[i].idFormaDid === '') {
      return false;
    }
  }
  return true;
}

/* eslint-disable */
function saveButtonValidator(weeklyOccurrences, startDate, endDate) {
  for (const dayOccurrence in weeklyOccurrences) {
    if (!occurrencesChecker(weeklyOccurrences[dayOccurrence])) {
      return false;
    }
  }
  if (occurrencesCounter(weeklyOccurrences) === 0) {
    return false;
  }
  if (startDate === 'undefined' || endDate == null) {
    return false;
  }
  return true;
}

/* eslint-enable */
function SaveButton({ occurrencesValidation, onSaveModal }) {
  if (occurrencesValidation) {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onSaveModal()}
      >
        Salva
      </button>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-primary disabled"
    >
      Salva
    </button>
  );
}

SaveButton.propTypes = {
  occurrencesValidation: PropTypes.bool.isRequired,
  onSaveModal: PropTypes.func.isRequired,
};

class ModalWeeklySchedule extends React.Component {
  constructor(props) {
    super(props);
    const minDate = moment();
    const maxDate = moment();
    minDate.year(this.props.registryYear - 2);
    minDate.month(8);
    minDate.date(1);
    maxDate.year(this.props.registryYear + 1);
    maxDate.month(11);
    maxDate.date(31);
    this.state = {
      indexRow: 0,
      modalIsOpen: false,
      formIsOpen: false,
      rules: [],
      selected: null,
      occurrences: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      },
      startDate: null,
      minDate,
      maxDate,
      dayrow: 0,
    };
  }

  setTableRef = (ref) => { this.tableRef = ref; }

  setSingleOccurrenceFormRef = (ref) => { this.SingleOccurrenceFormRef = ref; }

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    });
  }

  actionFormatter = (cell) => {
    if (cell) {
      return (
        <button
          type="button"
          className="btn btn-warning react-bs-table-add-btn"
          onClick={e => this.deleteRow(e, cell)}
        >
          <i className="glyphicon glyphicon-trash"></i>
          Elimina
        </button>
      );
    }
    return false;
  }

  formaDidFormatter = (cell) => {
    if (cell) {
      const formaDid = aoObjectOf(
        this.props.formeDidScheduled,
        parseInt(cell, 10),
        'idFormaDidattica');
      return (
        <span>
        {formaDid.descrizione}
        </span>
      );
    }
    return '';
  }

  editRowProp = {
    mode: 'click',
    blurToSave: true,
    afterSaveCell: (row, cellName, cellValue) => {
      const occurrencesCopy = _.cloneDeep(this.state.occurrences);
      const indexKey = aoIndexOf(this.state.occurrences[this.state.selected], row.rowId, 'rowId');
      occurrencesCopy[this.state.selected][indexKey][cellName] = cellValue;
      this.setState({
        occurrences: occurrencesCopy,
      });
    },
  };

  openForm = () => {
    this.setState({
      formIsOpen: true,
    });
  }

  closeForm = () => {
    this.setState({
      formIsOpen: false,
    });
  }

  addRow = () => {
    const occurrence = this.SingleOccurrenceFormRef.getFormData();
    const newRow = {
      rowId: `${this.state.indexRow}`,
      hourStart: occurrence.time.format('HH:mm'),
      duration: occurrence.durata,
      room: occurrence.aula,
      place: occurrence.sede,
      idFormaDid: occurrence.idFormaDid,
    };
    const result = this.tableRef.handleAddRow(newRow);
    if (result) {
      console.log('ok');
    } else {
      this.setState({
        occurrences: {
          ...this.state.occurrences,
          [this.state.selected]: this.state.occurrences[this.state.selected].concat([newRow]),
        },
        indexRow: this.state.indexRow + 1,
        formIsOpen: false,
      });
      this.SingleOccurrenceFormRef.resetFormData();
    }
  }

  deleteRow = (event, rowId) => {
    const indexKey = aoIndexOf(this.state.occurrences[this.state.selected], rowId, 'rowId');
    this.tableRef.handleDropRow(rowId);
    const occurrencesCopy = _.cloneDeep(this.state.occurrences);
    occurrencesCopy[this.state.selected].splice(indexKey, 1);
    this.setState({
      occurrences: occurrencesCopy,
    });
  }

  handleChangeStart = (date) => {
    this.setState({
      startDate: date,
    });
  }

  handleChangeEnd = (date) => {
    this.setState({
      endDate: date,
    });
  }

  handleChangeDay = (selection) => {
    this.SingleOccurrenceFormRef.resetFormData();
    this.setState({
      formIsOpen: false,
      selected: selection.id,
    });
  }

  saveModal = () => {
    const generatedOccurrences = generateDateFromUser(
      this.state.startDate,
      this.state.endDate,
      this.state.occurrences);
    this.props.onSaveClick(this.props.registryId, generatedOccurrences);
    this.setState({
      modalIsOpen: false,
      occurrences: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      },
      selected: null,
      startDate: null,
    });
  }

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      formIsOpen: false,
      occurrences: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
      },
      selected: null,
      startDate: null,
      endDate: null,
    });
  }

  render() {
    const buttonState = this.state.formIsOpen ?
                        'btn btn-info react-bs-table-add-btn notshown' :
                        'btn btn-info react-bs-table-add-btn shown';
    const navDays = [
      { id: 'monday', icon: '', text: 'lunedi',
        tocount: {
          tooltip: 'lezioni tenute il lunedi',
          arr: this.state.occurrences.monday,
        },
      },
      { id: 'tuesday', icon: '', text: 'martedi',
        tocount: {
          tooltip: 'lezioni tenute il tuesday',
          arr: this.state.occurrences.tuesday,
        },
      },
      { id: 'wednesday', icon: '', text: 'mercoledi',
        tocount: {
          tooltip: 'lezioni tenute il wednesday',
          arr: this.state.occurrences.wednesday,
        },
      },
      { id: 'thursday', icon: '', text: 'giovedi',
        tocount: {
          tooltip: 'lezioni tenute il thursday',
          arr: this.state.occurrences.thursday,
        },
      },
      { id: 'friday', icon: '', text: 'venerdi',
        tocount: {
          tooltip: 'lezioni tenute il friday',
          arr: this.state.occurrences.friday,
        },
      },
      { id: 'saturday', icon: '', text: 'sabato',
        tocount: {
          tooltip: 'lezioni tenute il saturday',
          arr: this.state.occurrences.saturday,
        },
      },
    ];
    if (!occurrencesChecker(this.state.occurrences.monday)) {
      navDays[0].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[0].icon = '';
    }
    if (!occurrencesChecker(this.state.occurrences.tuesday)) {
      navDays[1].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[1].icon = '';
    }
    if (!occurrencesChecker(this.state.occurrences.wednesday)) {
      navDays[2].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[2].icon = '';
    }
    if (!occurrencesChecker(this.state.occurrences.thursday)) {
      navDays[3].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[3].icon = '';
    }
    if (!occurrencesChecker(this.state.occurrences.friday)) {
      navDays[4].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[4].icon = '';
    }
    if (!occurrencesChecker(this.state.occurrences.saturday)) {
      navDays[5].icon = 'glyphicon glyphicon-alert';
    } else {
      navDays[5].icon = '';
    }

    const datesNotEmpty = (this.state.startDate && this.state.endDate);
    const dayNotSelected = (this.state.selected !== null);

    return (
      <div className="row-buttons">
        <button type="button" className="btn btn-success" onClick={this.openModal}>
          <i className="glyphicon glyphicon-calendar"></i>
          <span className="mg2">Orario Settimanale</span>
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEscPressed={false}
          style={customStyles}
          className="Modal__Bootstrap modal-dialog modal-lg"
        >
          <div className="modal-content">
            <div className="modal-header withseagreen">
              <button type="button" className="close" onClick={this.closeModal}>
                <span aria-hidden="true">x</span>
                <span className="sr-only">Close</span>
              </button>
              <h4 className="modal-title">Inserisci Orario settimanale</h4>
            </div>
            <div className="modal-body row no-vertical-padding">
              <div className="row text-center range-date-picker">
                <div className="row">
                  <div className="col-md-12">
                    <h5>STEP 1: Durata del corso</h5>
                  </div>
                </div>
                <div className="row displayMiddle">
                  <div className="col-md-3">
                    <label className="highlight-right">DATA INIZIO CORSO *</label>
                  </div>
                  <div className="col-md-2">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      minDate={this.state.minDate}
                      maxDate={this.state.maxDate}
                      selected={this.state.startDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleChangeStart}
                      className="inputStyle"
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="highlight-right">DATA FINE CORSO *</label>
                  </div>
                  <div className="col-md-2">
                    <DatePicker
                      dateFormat="DD/MM/YYYY"
                      minDate={this.state.minDate}
                      maxDate={this.state.maxDate}
                      selected={this.state.endDate}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate}
                      onChange={this.handleChangeEnd}
                      className="inputStyle"
                    />
                  </div>
                </div>
              </div>
              <Loader
                show={!datesNotEmpty}
                backgroundStyle={backStyle}
                foregroundStyle={frontStyle}
                message={'Compilare le date di inizio e fine corso.'}
              >
                <div className="row no-margin text-center">
                  <div className="col-md-2 border-right-green">
                    <h5>
                      <b>
                        Scegli giorno
                      </b>
                    </h5>
                  </div>
                  <div className="col-md-10">
                    <h5>
                      STEP 2: Orario delle lezioni
                    </h5>
                  </div>
                </div>
                <div className="row no-margin">
                  <div className="col-md-2 border-right-green no-padding">
                    <SideNav
                      selected={this.state.selected}
                      navs={navDays}
                      navtype="icon-right"
                      style={rightStyle}
                      onSelection={this.handleChangeDay}
                    />
                  </div>
                  <div className="col-md-10">
                    <Loader
                      show={!dayNotSelected}
                      backgroundStyle={backStyle}
                      foregroundStyle={frontStyle}
                      message={'Selezionare il giorno della settimana.'}
                    >
                      <div className="row vmg5 text-right">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className={buttonState}
                              onClick={this.openForm}
                            >
                              <i className="glyphicon glyphicon-plus"></i>
                              Aggiungi lezione
                            </button>
                          </div>
                          <SingleOccurrenceForm
                            ref={this.setSingleOccurrenceFormRef}
                            formeDidScheduled={this.props.formeDidScheduled}
                            isHidden={!this.state.formIsOpen}
                            onSaveClick={this.addRow}
                            onCancelClick={this.closeForm}
                          />
                        </div>
                      </div>
                      <BootstrapTable
                        data={this.state.occurrences[this.state.selected] || []}
                        cellEdit={this.editRowProp}
                        ref={this.setTableRef}
                        options={{ noDataText: 'Nessuna attività registrata' }}
                      >
                        <TableHeaderColumn
                          dataField="hourStart"
                          editable={{ validator: hourStartValidator }}
                        >Ora Inizio</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="duration"
                          editable={{ validator: durationValidator }}
                          customEditor={{
                            getElement: createDurationEditor,
                          }}
                        >Durata</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="room"
                          editable={{ validator: roomValidator }}
                        >Aula</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="place"
                          editable={{ validator: roomValidator }}
                        >Sede</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="idFormaDid"
                          dataFormat={this.formaDidFormatter}
                          customEditor={{
                            getElement: createFormaDidEditor,
                            customEditorParameters: {
                              formeDid: this.props.formeDidScheduled,
                            },
                          }}
                        >Forma Did.</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="rowId"
                          dataFormat={this.actionFormatter}
                          editable={false}
                          isKey
                        />
                      </BootstrapTable>
                    </Loader>
                  </div>
                </div>
              </Loader>
            </div>
            <div className="modal-footer withseagreen">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.closeModal}
              >
                Annulla
              </button>
              <SaveButton
                occurrencesValidation={saveButtonValidator(
                    this.state.occurrences,
                    this.state.startDate,
                    this.state.endDate
                  )}
                onSaveModal={this.saveModal}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

ModalWeeklySchedule.propTypes = {
  registryId: PropTypes.number.isRequired,
  registryYear: PropTypes.number.isRequired,
  formeDidScheduled: PropTypes.arrayOf(PropTypes.object),
  onSaveClick: PropTypes.func.isRequired,
};

export default ModalWeeklySchedule;
