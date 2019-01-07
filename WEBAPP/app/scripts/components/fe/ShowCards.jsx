import React, { PropTypes } from 'react';
import { Table, Row, Col, Card, Icon } from 'antd';
import UpdateCardButton from 'components/fe/AddButton.jsx';
import UpdateCardTable from 'components/fe/AddButtonTable.jsx';
import ViewCard from 'components/fe/ViewCardButton.jsx';
import { cardQuantity, formatQuantity } from 'util/CardCollection.jsx';
// import { imgCardLink, tableCardLink } from 'util/NavigationUtils.jsx';
import { tableCardLink } from 'util/NavigationUtils.jsx';

/* {
 *             "name": "Dark Confidant",
 *             "names": null,
 *             "manaCost": "{1}{B}",
 *             "cmc": 2,
 *             "colors": [
 *                 "Black"
 *             ],
 *             "colorIdentity": [
 *                 "B"
 *             ],
 *             "type": "Creature — Human Wizard",
 *             "types": [
 *                 "Creature"
 *             ],
 *             "supertypes": null,
 *             "subtypes": [
 *                 "Human",
 *                 "Wizard"
 *             ],
 *             "rarity": "Rare",
 *             "set": "RAV",
 *             "setName": "Ravnica: City of Guilds",
 *             "text":
 *             "flavor": "Greatness, at any cost.",
 *             "artist": "Ron Spears",
 *             "number": "81",
 *             "power": "2",
 *             "toughness": "1",
 *             "loyalty": 0,
 *             "layout": "normal",
 *             "multiverseid": 83771,
 *             "variations": null,
 *             "imageUrl": "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=83771&type=card",
 *             "watermark": "",
 *             "border": "",
 *             "timeshifted": false,
 *             "hand": 0,
 *             "life": 0,
 *             "reserved": false,
 *             "releaseDate": {},
 *             "starter": false,
 *             "rulings": null,
 *             "foreignNames": [
 *                 {
 *                     "name": "黑暗亲信",
 *                     "language": "Chinese Simplified",
 *                     "multiverseid": 111338
 *                 },
 *                 {
 *                     "name": "Dunkler Mitwisser",
 *                     "language": "German",
 *                     "multiverseid": 111644
 *                 },
 *                 {
 *                     "name": "Obscur confident",
 *                     "language": "French",
 *                     "multiverseid": 111950
 *                 },
 *                 {
 *                     "name": "Confidente Oscuro",
 *                     "language": "Italian",
 *                     "multiverseid": 112256
 *                 },
 *                 {
 *                     "name": "闇の腹心",
 *                     "language": "Japanese",
 *                     "multiverseid": 112562
 *                 },
 *                 {
 *                     "name": "Confidente Sombrio",
 *                     "language": "Portuguese (Brazil)",
 *                     "multiverseid": 112868
 *                 },
 *                 {
 *                     "name": "Confidente oscuro",
 *                     "language": "Spanish",
 *                     "multiverseid": 113174
 *                 },
 *                 {
 *                     "name": "Темный наперсник",
 *                     "language": "Russian",
 *                     "multiverseid": 114276
 *                 }
 *             ],
 *             "printings": [
 *                 "pJGP",
 *                 "RAV",
 *                 "MMA",
 *                 "MM2"
 *             ],
 *             "originalText":
 *             "originalType": "Creature — Human Wizard",
 *             "id": "7bde4abfee946b181bef03f281599c3da2a72050",
 *             "source": "",
 *             "legalities": [
 *                 {
 *                     "format": "Commander",
 *                     "legality": "Legal"
 *                 },
 *                 {
 *                     "format": "Legacy",
 *                     "legality": "Legal"
 *                 },
 *                 {
 *                     "format": "Modern",
 *                     "legality": "Legal"
 *                 },
 *                 {
 *                     "format": "Ravnica Block",
 *                     "legality": "Legal"
 *                 },
 *                 {
 *                     "format": "Vintage",
 *                     "legality": "Legal"
 *                 }
 *             ]
 * }*/

const { Meta } = Card;

class ShowCards extends React.Component {

  renderCards = (cards) => (
    cards.map(card => (
      <Col key={card.multiverseid} span={4}>
        <Card
          className="sep-bottom"
          cover={<div className="card-wrapper">
            <div className="counter">
              <Icon type="copy" />
              <span className="count">
                {formatQuantity(cardQuantity(card.multiverseid, this.props.collection))}
              </span>
            </div>
            <img className="full-width" alt={card.name} src={card.imageUrl} />
          </div>}
          actions={
          [<UpdateCardTable
            card={{
              info: card,
              quantity: cardQuantity(card.multiverseid, this.props.collection) }}
            onUpdate={this.props.updateCard}
            viewMode={this.props.viewMode}
            updateType="add"
          />,
            <UpdateCardButton
              card={{
                idCard: card.multiverseid,
                idSet: card.set,
                quantity: cardQuantity(card.multiverseid, this.props.collection) }}
              onUpdate={this.props.removeCard}
              updateType="remove"
            />,
            <ViewCard card={card} />,
            <Icon type="ellipsis" />,
          ]}
        >
          <Meta
            className="no-display"
          />
        </Card>
      </Col>
    ))
  )

  render() {
    console.log('props showCard', this.props);
    if (this.props.viewMode === 'image') {
      return (
        <Row gutter={16}>
          {this.renderCards(this.props.cards)}
        </Row>
      );
    }
    const locale = {
      filterConfirm: 'Cerca',
      filterReset: 'Resetta',
      emptyText: 'Nessun carta trovata',
    };
    const columns = [
      {
        title: 'Carta',
        dataIndex: 'name',
        key: 'name',
        onCellClick: tableCardLink,
        render: text => <a>{text}</a>,
      },
      {
        title: 'Tipo',
        dataIndex: 'type',
        key: 'cardType',
      },
      {
        title: 'Edizione',
        dataIndex: 'setName',
        key: 'setName',
      },
      {
        title: 'Rarità',
        dataIndex: 'rarity',
        key: 'rarity',
      },
      {
        title: 'Numero di Collezione',
        dataIndex: 'number',
        key: 'collNumber',
      },
      {
        title: 'Quantità posseduta(foil)',
        dataIndex: 'multiverseid',
        render: id => formatQuantity(cardQuantity(id, this.props.collection)),
      },
      {
        title: 'Azioni',
        key: 'action',
        render: (text, record) => (
          <UpdateCardTable
            card={{
              info: record,
              quantity: cardQuantity(record.multiverseid, this.props.collection),
            }}
            onUpdate={this.props.updateCard}
            viewMode={this.props.viewMode}
          />
        ),
      },
    ];
    return (
      <div style={{ background: '#ffffff' }}>
        <Table
          rowKey="multiverseid"
          className="registriTable"
          locale={locale}
          columns={columns}
          dataSource={this.props.cards}
        />
      </div>
    );
  }
}

ShowCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  collection: PropTypes.arrayOf(PropTypes.object),
  updateCard: PropTypes.func,
  removeCard: PropTypes.func,
  viewMode: PropTypes.string,
};

export default ShowCards;

