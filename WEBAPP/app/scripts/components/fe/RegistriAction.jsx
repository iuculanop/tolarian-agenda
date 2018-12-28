import React, { PropTypes } from 'react';

import CloseButton from 'components/modal/ModalCloseAlert.jsx';
import DeleteButton from 'components/modal/ModalDeleteAlert.jsx';
import PrintButton from 'components/fe/PrintPdf.jsx';

function RegistroAction({ registryInfo, registryOccurrences, userInfo,
                          onCloseRegistry, onOpenRegistry, onDeleteRegistry, trasversal }) {
  switch (registryInfo.stato) {
    case 'C':
      return (
        <div className="box box-unimi">
          <div className="box-header with-border">
            <h3 className="box-title">Azioni sul registro</h3>
            <span className="label label-unimi pull-right">
              <i className="fa fa-database"></i>
            </span>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <button
                  onClick={() => onOpenRegistry(registryInfo.idRegistro)}
                  className="btn btn-primary btn-block vmg5"
                >
                  <i className="fa fa-unlock-alt fa-lg"></i><br />
                  <span className="text-center">Riapri</span>
                </button>
              </div>
              <PrintButton
                registryInfo={registryInfo}
                userInfo={userInfo}
                trasversal={trasversal}
              />
              <div className="col-md-4 col-lg-4">
                <button href="#" className="btn btn-primary btn-block vmg5 disabled">
                  <i className="fa fa-eraser fa-lg"></i><br />
                  <span className="text-center">Cancella</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    case 'A':
    case 'Z':
      return (
        <div className="box box-unimi">
          <div className="box-header with-border">
            <h3 className="box-title">Azioni sul registro</h3>
            <span className="label label-unimi pull-right">
              <i className="fa fa-database"></i>
            </span>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-md-4 col-lg-4">
                <button
                  className="btn btn-primary btn-block vmg5 disabled"
                >
                  <i className="fa fa-unlock-alt fa-lg"></i><br />
                  <span className="text-center">Riapri</span>
                </button>
              </div>
              <PrintButton
                registryInfo={registryInfo}
                userInfo={userInfo}
                trasversal={trasversal}
              />
              <div className="col-md-4 col-lg-4">
                <button href="#" className="btn btn-primary btn-block vmg5 disabled">
                  <i className="fa fa-eraser fa-lg"></i><br />
                  <span className="text-center">Cancella</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    case 'N':
    default:
      return (
        <div className="box box-unimi">
          <div className="box-header with-border">
            <h3 className="box-title">Azioni sul registro</h3>
            <span className="label label-unimi pull-right">
              <i className="fa fa-database"></i>
            </span>
          </div>
          <div className="box-body">
            <div className="row">
              <CloseButton
                registryInfo={registryInfo}
                occurrences={registryOccurrences}
                closeRegistry={onCloseRegistry}
                trasversal={trasversal}
              />
              <PrintButton
                registryInfo={registryInfo}
                userInfo={userInfo}
                trasversal={trasversal}
              />
              <DeleteButton
                registryInfo={registryInfo}
                deleteRegistry={onDeleteRegistry}
              />
            </div>
          </div>
        </div>
      );
  }
}

/*
<button href="#" className="btn btn-primary mg5">
              <i className="fa fa-eraser fa-lg"></i>
              <span className="mg2">Cancella Registro</span>
            </button>
*/

/* VALORI POSSIBILI:
N= aperto
C= chiuso
A= chiuso e approvato
Z= chiuso, approvato e archiviato
 */

RegistroAction.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  registryOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  userInfo: PropTypes.object.isRequired,
  onCloseRegistry: PropTypes.func.isRequired,
  onOpenRegistry: PropTypes.func.isRequired,
  onDeleteRegistry: PropTypes.func.isRequired,
  trasversal: PropTypes.bool,
};

export { RegistroAction };
