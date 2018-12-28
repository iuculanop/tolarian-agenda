import React, { PropTypes } from 'react';
import { aoObjectOf } from 'util/ArrayUtils.jsx';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { editFormatter, editFormatterNoReq } from 'util/Formatters.jsx';
import { sortDate, sortName } from 'util/Sorting.jsx';
import DeleteButton from 'components/modal/ModalConfirmDelete.jsx';
import ModalTrasversalActivity from 'components/modal/ModalTrasversalActivity.jsx';
import FormaDidSelect from 'components/form/FormaDidSelect.jsx';
import TableDatePicker from 'components/form/TableDatePicker.jsx';
import InputFloat from 'components/form/InputFloat.jsx';
import _ from 'lodash';
import Notification from 'components/generic/Notification.jsx';

function checkModified(obj, property, value) {
  if (obj[property] && obj[property].toString() === value) {
    return false;
  }
  return true;
}

function formaDidFormatter(cell, row) {
  return row.descFormaDid;
}

const createFormaDidEditor = (onUpdate, props) =>
  (<FormaDidSelect onUpdate={onUpdate} noDefault {...props} />);

const createDayEditor = (onUpdate, props) =>
  (<TableDatePicker onUpdate={onUpdate} context="trasversal" {...props} />);

const createDurationEditor = (onUpdate, props) =>
  (<InputFloat onUpdate={onUpdate} max="999" {...props} />);

class TrasversalActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  setNotificationRef = (ref) => { this.Notification = ref; }

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

  updateRow = (row, cellName, cellValue) => {
    const occurrences = [];
    let retVal;
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
    return retVal;
  }

  render() {
    const trasOccurrences = this.props.registryOccurrences;
    const editRowProp = {
      mode: 'click',
      blurToSave: true,
      beforeSaveCell: (row, cellName, cellValue) => (this.updateRow(row, cellName, cellValue)),
    };

    const isCondensed = trasOccurrences.length > 12 && this.props.isLoaded;
    let height = '';
    if (isCondensed) {
      height = '450px';
    }

    switch (this.props.registryInfo.stato) {
      case 'C':
      case 'A':
      case 'Z':
        return (
          <div className="box box-solid box-unimi">
            <div className="box-header">
              <h3 className="box-title">
                Elenco Attività
              </h3>
            </div>
            <div className="box-body">
              <BootstrapTable
                data={trasOccurrences}
                height={height}
                options={{ noDataText: 'Non sono presenti attività' }}
                condensed={isCondensed}
                striped
                hover
              >
                <TableHeaderColumn
                  dataField="idFormaDid"
                  dataFormat={formaDidFormatter}
                  width="340"
                  dataSort
                  sortFunc={sortName}
                  columnClassName="multiline"
                >Attivita didattica</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="descrizione"
                  columnClassName="multiline"
                >Descrizione</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="altreInfo"
                  columnClassName="multiline"
                >Altre Informazioni</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="data"
                  width="150"
                  columnClassName="multiline"
                  dataSort
                  sortFunc={sortDate}
                >Data</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="ore"
                  width="70"
                  columnClassName="multiline"
                >Ore</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="rId"
                  hidden
                  isKey
                />
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
                Elenco Attività
              </h3>
            </div>
            <div className="box-body">
              <BootstrapTable
                height={height}
                data={trasOccurrences}
                cellEdit={editRowProp}
                options={{ noDataText: 'Non sono presenti attività' }}
                condensed={isCondensed}
                striped
                hover
              >
                <TableHeaderColumn
                  dataField="rId"
                  width="50"
                  isKey
                  dataFormat={this.actionFormatter}
                />
                <TableHeaderColumn
                  dataField="idFormaDid"
                  width="340"
                  dataSort
                  sortFunc={sortName}
                  columnClassName="td-edit-enabled multiline"
                  dataFormat={formaDidFormatter}
                  customEditor={{
                    getElement: createFormaDidEditor,
                    customEditorParameters: {
                      formeDid: this.props.attivitaDid,
                    },
                  }}
                >Attivita didattica</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="descrizione"
                  dataFormat={editFormatterNoReq}
                  columnClassName="td-edit-enabled multiline"
                >Descrizione</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="altreInfo"
                  dataFormat={editFormatterNoReq}
                  columnClassName="td-edit-enabled multiline"
                >Altre Informazioni</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="data"
                  width="150"
                  dataSort
                  sortFunc={sortDate}
                  dataFormat={editFormatterNoReq}
                  columnClassName="td-edit-enabled multiline"
                  customEditor={{
                    getElement: createDayEditor,
                    customEditorParameters: {
                      year: this.props.registryInfo.annoAccademico,
                    },
                  }}
                >Data</TableHeaderColumn>
                <TableHeaderColumn
                  dataField="ore"
                  width="70"
                  dataFormat={editFormatter}
                  columnClassName="td-edit-enabled multiline"
                  customEditor={{
                    getElement: createDurationEditor,
                  }}
                >Ore</TableHeaderColumn>
              </BootstrapTable>
              <Notification ref={this.setNotificationRef} />
              <ModalTrasversalActivity
                registryId={this.props.registryInfo.idRegistro}
                registryYear={this.props.registryInfo.annoAccademico}
                formeDidScheduled={this.props.attivitaDid}
                onSaveClick={this.props.onInsertActivity}
              />
            </div>
          </div>
        );
    }
  }
}

TrasversalActivities.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  attivitaDid: PropTypes.arrayOf(PropTypes.object),
  isLoaded: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onInsertActivity: PropTypes.func.isRequired,
  deleteOccurrences: PropTypes.func.isRequired,
  updateOccurrences: PropTypes.func,
};

export { TrasversalActivities };
