import React from 'react';

export default function FormInput() {
  class InputComponent extends React.Component {
    handleChange = (event) => {
      this.props.onInputChange(this.props.name, event.target.value);
    }

    render() {
      return (
        <input
          type={this.props.attributes.type}
          className={this.props.attributes.class}
          ref={this.props.attributes.ref}
          value={this.props.attributes.value}
          onChange={this.handleChange}
          placeholder={this.props.attributes.placeholder}
        />
      );
    }
  }
  InputComponent.propTypes = {
    name: React.PropTypes.string.isRequired,
    attributes: React.PropTypes.object.isRequired,
    onInputChange: React.PropTypes.func.isRequired,
  };
}
