import React, { PropTypes } from 'react';
import { registriWS } from 'util/AppConfig.jsx';

const urlPDF = `${registriWS}/report`;

class PrintPdf extends React.Component {

  generatePdf = () => {
    // ricostruisco l'endpoint del servizio
    let context;
    if (this.props.trasversal) {
      context = '/registroTrasversale/';
    } else {
      context = '/registro/';
    }
    // ricostruisco la url di generazione del pdf
    let urlToPdf;
    // verifico se sto impersonando qualcuno o no
    if (this.props.userInfo.otherCF) {
      urlToPdf = `${urlPDF}${context}${this.props.registryInfo.idRegistro}
?cf=${this.props.userInfo.otherCF}`;
    } else {
      urlToPdf = `${urlPDF}${context}${this.props.registryInfo.idRegistro}`;
    }
    // appHistory.push(urlToPdf);
    window.location.assign(urlToPdf);
  }

  render() {
    return (
      <div className="col-md-4 col-lg-4">
        <button
          onClick={this.generatePdf}
          className="btn btn-primary btn-block vmg5"
        >
          <i className="glyphicon glyphicon-print"></i><br />
          <span className="text-center">Stampa</span>
        </button>
      </div>
    );
  }
}

PrintPdf.propTypes = {
  registryInfo: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  trasversal: PropTypes.bool,
};

export default PrintPdf;
