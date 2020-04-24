/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import Continuous from "../Parameters/Continuous";
import Discrete from "../Parameters/Discrete";
import Loading from "../Loading/Loading";
import ErrorView from "../Errors/Error";

/**
 * Select the parameters.
 */
class Step4 extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        options: {
          headers: {
            Authorization: 'Token ' + props.token,
            Accept: "application/json"
          },
          method: props.method || 'GET',
          cache: 'no-cache',
        },
        error: null,
        isLoaded: false,
        results: {},
        parameters: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetch the parameters for the selected metric.
   */
  componentDidMount() {
    let uri = this.props.uri + this.props.metric + '/';
    fetch(uri, this.state.options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299)
          return response.json();
        throw Error(response.statusText)
      })
      .then(
        (data) => {
          // TODO: Django side, add this structure
          data['parameters'] = [{
              name: 'Lambda',
              type: 'int',
              min: 0,
              max: 200
            },
            {
              name: 'Optimizer',
              type: 'dis',
              values: ['Adam', 'SGD', 'RMSprop']
            },
            {
              name: 'Delta',
              type: 'float',
              min: 0,
              max: 100
            }
          ];
          this.setState({
            isLoaded: true,
            results: data
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /**
   * Local update of the parameters.
   * TODO: add logic for selecting all param before call father handler.
   *
   * @param event
   */
  handleChange(event) {
    // TODO: add checks
    let {name, value} = event;

    this.setState({
      parameters: {...this.state.parameters, [name]: value}
    }, function () {
      this.props.handleChange({
        name: 'parameters',
        value: this.state.parameters
      });
    });
  }

  getParam(param) {
    let type = param.type;
    if (type === 'int' || type === 'float')
      return (
        <Continuous
          name={param.name}
          minValue={param.min}
          maxValue={param.max}
          handleChange={this.handleChange}
        />
      );
    else if (type === 'dis' || type === 'cat')
      return (
        <Discrete
          name={param.name}
          values={param.values}
          handleChange={this.handleChange}
        />
      );
    else
      throw Error("Unknown");
  }

  render() {
    if (this.state.error) {
      console.error(this.state.error.message);
      return (<ErrorView message={this.state.error.message} />);
    } else if (!this.state.isLoaded) {
      return <Loading />;
    } else {
      return (
        <Form.Group controlId="parameters">
          <h3> Choose the parameters: </h3>
          {this.state.results.parameters.map((param) => (
            this.getParam(param)
          ))}
        </Form.Group>
      );
    }
  }
}

export default Step4;