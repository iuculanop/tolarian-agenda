import React, { PropTypes } from 'react';

function RegistroProgram({ registryProgram }) {
  let programma = 'Il programma non è presente in banca dati';
  if (registryProgram.programma) {
    programma = registryProgram.programma;
  } else if (registryProgram.programmaModuli) {
    const programmaArray = registryProgram.programmaModuli
                                          .filter((v) => v.programma)
                                          .map((v) => v.programma);
    if (programmaArray.length > 0) {
      programma = programmaArray.join('\n');
    } else {
      programma = '';
    }
  }
  if (registryProgram.altreInformazioni) {
    programma = `${programma} ${registryProgram.altreInformazioni}`;
  }

  if (programma.length === 0) {
    programma = 'Il programma non è presente in banca dati';
  }

  return (
    <div className="box box-solid box-unimi collapsed-box">
      <div className="box-header">
        <h3 className="box-title">
          <a href="" data-widget="collapse">Programma Didattico</a>
        </h3>
        <div className="box-tools pull-right">
          <button className="btn btn-box-tool" data-widget="collapse">
            <i className="fa fa-chevron-down"></i>
          </button>
        </div>
      </div>
      <div className="box-body">
        <p className="withpre">{programma}</p>
      </div>
    </div>
  );
}

RegistroProgram.propTypes = {
  registryProgram: PropTypes.object.isRequired,
};

export { RegistroProgram };
