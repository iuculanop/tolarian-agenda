import React, { PropTypes } from 'react';

import { fetchEduRec } from 'actions';
import ReduxRegistro from 'containers/fe/ReduxRegistroMain.jsx';
/*
import ReduxElencoAttivita from 'containers/fe/ReduxElencoAttivita.jsx';
import ReduxRegistroSummary from 'containers/fe/ReduxRegistroSummary.jsx';
import ReduxRegistroStatus from 'containers/fe/ReduxRegistroStatus.jsx';
import ReduxHoursCounter from 'containers/fe/ReduxHoursCounter.jsx';
import ReduxRegistroActions from 'containers/fe/ReduxRegistroActions.jsx';
*/

class EditRegistro extends React.Component {
  constructor(props) {
    super(props);
    const idRegistro = this.props.params.id;
    this.state = {
      registro: {
        id: idRegistro,
        anno_accademico: '2015/2016',
        cod_corso: 'F8X',
        desc_corso: 'SCIENZE E TECNOLOGIE PER LO STUDIO',
        cod_modulo: null,
        cod_edizione: 'F8X-110.16.1',
        cod_af: 'F8X-110',
        desc_af: 'INFORMATICA GENERALE',
        nome: 'Nome del registro aperto',
        stato: 'N',
      },
    };
  }

  render() {
    return (
      <ReduxRegistro />
    );
  }
}

EditRegistro.propTypes = {
  params: PropTypes.object.isRequired,
};

function onEnterEditRegistro(store, nextState) {
  store.dispatch(fetchEduRec(nextState.params.id));
}

export { EditRegistro, onEnterEditRegistro };
