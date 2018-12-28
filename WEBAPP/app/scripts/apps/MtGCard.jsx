import React, { PropTypes } from 'react';

import { fetchCard } from 'actions';
import ReduxCardSummary from 'containers/fe/ReduxCardSummary.jsx';

/*
import ReduxElencoAttivita from 'containers/fe/ReduxElencoAttivita.jsx';
import ReduxRegistroSummary from 'containers/fe/ReduxRegistroSummary.jsx';
import ReduxRegistroStatus from 'containers/fe/ReduxRegistroStatus.jsx';
import ReduxHoursCounter from 'containers/fe/ReduxHoursCounter.jsx';
import ReduxRegistroActions from 'containers/fe/ReduxRegistroActions.jsx';
*/

class CardDetail extends React.Component {
  constructor(props) {
    super(props);
    const idCard = this.props.params.idCard;
    this.state = {
      card: {
        id: idCard,
      },
    };
  }

  render() {
    return (
      <div>
        <ReduxCardSummary />
      </div>
    );
  }
}

CardDetail.propTypes = {
  params: PropTypes.object.isRequired,
};

function onEnterCardDetail(store, nextState) {
  store.dispatch(fetchCard(nextState.params.idCard));
}

export { CardDetail, onEnterCardDetail };
