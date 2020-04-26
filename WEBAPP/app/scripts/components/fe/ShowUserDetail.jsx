import React, { PropTypes } from 'react';
import { Card, Col, Row } from 'antd';

/* eslint-disable */
class ShowUserDetail extends React.Component {

  render() {
    return (
      <Card title={this.props.card.name}>
        <Row gutter={16}>
          <Col span={4}>
            <Row>
              <Col span={24}>
                <img className="full-width" alt={this.props.card.name} src={this.props.card.imageUrl} />
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <p>
              <span className="card-summary">
                <strong>Rarità: </strong> {this.props.card.rarity} <br/>
              </span>
              <span className="card-summary">
                <strong>Set: </strong> {this.props.card.setName} <br/>
              </span>
              <span className="card-summary">
                <strong>Casting Cost: </strong> {this.props.card.manaCost} <br />
              </span>
              <span className="card-summary">
                <strong>Numero di Collezione: </strong> {this.props.card.number} <br/>
              </span>
              <span className="card-summary">
                <strong>Ristampe: </strong> {formatPrintings(this.props.card.printings)} <br/>
              </span>
              <span className="card-summary">
                <strong>Quantità posseduta: </strong>
                {qty} <br/>
              </span>
              <span className="card-summary">
                <strong>Testo: </strong><br/>
              </span> {this.props.card.text} <br/>
            </p>
          </Col>
          <Col span={7}>
            <div className="limited-height">
            <p>
              <strong>Rulings: </strong><br/> {formatRulings(this.props.card.rulings)} <br/>
            </p>
            </div>
          </Col>
          <Col span={6}>
            <p>Informazioni economiche qui. </p>
          </Col>
        </Row>
      </Card>
    );
  }
}

ShowUserDetail.propTypes = {
  user: PropTypes.object.isRequired,
  collection: PropTypes.arrayOf(PropTypes.object),
};

export default ShowUserDetail;
