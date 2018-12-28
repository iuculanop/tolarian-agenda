import React, { PropTypes } from 'react';
import Loader from 'react-loader-advanced';
import Spinner from 'components/generic/Spinner.jsx';
import ReduxTrasversalNotes from 'containers/fe/ReduxTrasversalNotes.jsx';
import ReduxTrasversalActivities from 'containers/fe/ReduxTrasversalActivities.jsx';
import ReduxTrasversalActions from 'containers/fe/ReduxTrasversalActions.jsx';
import ReduxTrasversalHours from 'containers/fe/ReduxTrasversalHours.jsx';
import ReduxRegistroStatus from 'containers/fe/ReduxRegistroStatus.jsx';

const backStyle = { backgroundColor: 'rgba(236,240,245,0.5)' };

class Trasversale extends React.Component {
  componentDidMount() {
    this.props.loadTrasversal();
  }

  render() {
    const isLoading = !this.props.isLoaded;
    return (
      <div>
        <Loader
          show={isLoading || this.props.isEditing || this.props.isSaving}
          message={<Spinner />}
          backgroundStyle={backStyle}
        >
          <div className="row">
            <div className="col-md-12 col-lg-9">
              <ReduxTrasversalNotes />
              <ReduxTrasversalActivities />
            </div>
            <div className="col-md-12 col-lg-3">
              <div className="row">
                <ReduxRegistroStatus context="trasversal" />
                <ReduxTrasversalHours />
              </div>
              <ReduxTrasversalActions />
            </div>
          </div>
        </Loader>
      </div>
    );
  }
}

Trasversale.propTypes = {
  isLoaded: PropTypes.bool,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
  loadTrasversal: PropTypes.func.isRequired,
};

export { Trasversale };
