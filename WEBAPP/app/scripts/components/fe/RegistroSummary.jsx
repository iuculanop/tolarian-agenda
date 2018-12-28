import React, { PropTypes } from 'react';
import _ from 'lodash';

function RegistroSummary({ registryInfo }) {
  const registry = _.cloneDeep(registryInfo);
  return (
    <div className="box box-solid box-unimi">
      <div className="box-header">
        <h3 className="box-title">
          Anagrafica Registro
        </h3>
      </div>
      <div className="box-body">
        <div className="left-summary">
          <p>
            <strong>Anno Accademico: </strong>
            {registry.annoAccademico - 1} / {registry.annoAccademico}
          </p>
          <p><strong>Corso di studio: </strong>
            {registry.descCDL}
          </p>
          <p>
            <strong>Insegnamento: </strong>
            {registry.descAF} ({registry.codAF})
          </p>
        </div>
        <div className="right-summary">
          <p>
            <strong>Modalità copertura: </strong>
            {registry.descCopertura}
          </p>
          <p>
            <strong>Edizione: </strong>
            {registry.codEdizione}
          </p>
          <p>
            <strong>Modulo/Turno: </strong>
            {registry.descModulo || 'Modulo Unico'}/{registry.descTurno || 'Turno Unico'}
          </p>
        </div>
      </div>
    </div>
  );
}

RegistroSummary.propTypes = {
  registryInfo: PropTypes.object.isRequired,
};

export { RegistroSummary };
