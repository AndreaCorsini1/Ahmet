/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import Continuous from "../Parameters/Continuous";
import Discrete from "../Parameters/Discrete";
import ErrorView from "../Errors/Error";

/**
 * Select the parameters.
 */
class Parameters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      parameters: props.value ? props.value : {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Local update of the parameters.
   *
   * @param event
   */
  handleChange(event) {
    let {name, value} = event;

    this.setState({
      parameters: {...this.state.parameters, [name]: value}
    }, function () {
      if (Object.keys(this.state.parameters).length ===
          Object.keys(this.props.space).length) {
        this.props.handleChange(this.state.parameters);
      }
    });
  }

  getParam(name) {
    let type = this.props.space[name];
    if (type === 'INTEGER' || type === 'FLOAT') {
      return (
        <Continuous
          name={name} value={this.state.parameters[name]} type={type}
          handleChange={this.handleChange}
        />
      );
    } else {
      return (
        <Discrete
          name={name} value={this.state.parameters[name]}
          options={type} type="CATEGORICAL"
          handleChange={this.handleChange}
        />
      );
    }
  }

  render() {
    if (this.state.error) {
      return (<ErrorView message={this.state.error.message} />);
    } else {
      return (
        <Form.Group controlId="parameters">
          <h3> Choose the parameters: </h3>
          {Object.keys(this.props.space).map((name) => (
            this.getParam(name))
          )}
        </Form.Group>
      );
    }
  }
}

export default Parameters;