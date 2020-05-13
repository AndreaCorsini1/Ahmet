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

    // Use function to update for avoiding race condition
    this.setState((state) => {
      return {parameters: {...state.parameters, [name]: value}};
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
      let param = "CATEGORICAL";
      if (type && typeof type[0] === 'number')
        param = "DISCRETE";
      return (
        <Discrete
          name={name} value={this.state.parameters[name]}
          options={type} type={param}
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
          <h3 className="text-muted font-weight-light"> Choose the parameters: </h3>
          {Object.keys(this.props.space).map((name) => (
              this.getParam(name))
          )}
        </Form.Group>
      );
    }
  }
}

export default Parameters;