import React, { PropTypes } from 'react';

class SuperUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newCF: '',
    };
  }

  onChangeUser = () => {
    this.props.onChangeUser(this.state.newCF, this.props.acYear);
  }

  changeValue = (event) => {
    this.setState({
      newCF: event.currentTarget.value,
    });
  }

  /* eslint-disable */
  render() {
    if (this.props.user && this.props.user.registriUserType === 'A') {
      return (
        <li className="dropdown messages-menu">
          <a
            href="#"
            title="Impersonifica docente"
            className="dropdown-toggle"
            data-toggle="dropdown"
          >
            <i className="fa fa-users fa-lg"></i>
          </a>
          <ul className="dropdown-menu borderbox-unimi">
            <li className="header">Impersonificazione docente</li>
            <li>
              <ul className="menu">
                <li>
                  <div className="menu-block">
                    <input
                      type="text"
                      name="CF"
                      onChange={this.changeValue}
                      value={this.state.newCF}
                      placeholder="CF utente da impersonare"
                    />
                  </div>
                </li>
              </ul>
            </li>
            <li className="footer menu-block">
              <div className="row">
                <div className="com-lg-12">
                  <button
                    onClick={this.onChangeUser}
                    className="btn btn-primary"
                  >
                    Impersonifica
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </li>
      );
    }
    return (<li></li>);
  }
}

SuperUser.propTypes = {
  user: PropTypes.object,
  acYear: PropTypes.string.isRequired,
  onChangeUser: PropTypes.func,
};

export default SuperUser;
