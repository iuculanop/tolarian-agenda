import React, { PropTypes } from 'react';

/* eslint-disable */
function RegistroIntro({ weeklyButton, singleButton }) {
  return (
    <div>
      <p className="text-center">
        <h3>Inserire le attività:</h3>
      </p>
      <div className="row">
        <div className="col-md-6 text-center">
          <h3>Settimana Tipo</h3>
          <p>
           Modalità di inserimento per intero calendario delle lezioni.
          </p>
          {weeklyButton}
        </div>
        <div className="col-md-6 text-center">
          <h3>Attivita Singola</h3>
          <p>
            Modalità di inserimento per singola lezione del corso.
          </p>
          {singleButton}
        </div>
      </div>
    </div>
  );
}

/*
<ol className="descrizione-intro">
        <li>Il modo più semplice, se il corso segue un orario settimanale, è inserirlo. In questo modo verranno generate in automatico tutte le attività. Successivamente potrai comunque aggiungere singole attività e modificare o eliminare quelle già inserite.
        </li>
        {weeklyButton}
        <li>In alternativa puoi aggiungere singolarmente ogni singola attività. Se si sceglie questa seconda strada non si potrà più utilizzare la generazione automatica a partire dall'orario da settimanale, se non cancellando prima tutte le attività già inserite.
        </li>
        {singleButton}
      </ol>
*/
/* eslint-enable */
RegistroIntro.propTypes = {
  weeklyButton: PropTypes.node,
  singleButton: PropTypes.node,
};

export default RegistroIntro;
