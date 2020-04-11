/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import {store} from "react-notifications-component";
import Loading from "../Loading/Loading";

/**
 * Select the algorithm.
 */
class Step2 extends React.Component {
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
        results: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch(this.props.uri, this.state.options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299)
          return response.json();
        throw Error(response.statusText)
      })
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            results: data.results
          });
        },
        // Note: it's important to handle errors here instead of a catch()
        // block so that we don't swallow exceptions from bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  /**
   * Merge data on metric before call father handler.
   * TODO: add check for completeness before calling father handler
   * @param event
   */
  handleChange(event) {
    let {name, value} = event.target;
    this.props.handleChange({
      name: name,
      value: value
    })
  }

  render() {
    // TODO: add problem type, classification or regression
    if (this.state.error) {
      console.error(this.state.error.message);
      store.addNotification({
        title: "Error",
        message: this.state.error.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
      })
    } else if (!this.state.isLoaded) {
      return <Loading />;
    } else {
      return (
      <Form.Group controlId="metricName">
      <h3> Choose a metric: </h3>
        {this.state.results.map((metric) => (
          <div key={`metric-${metric.id}`} className="mb-3">
            <Form.Check
              type='checkbox'
              name="metricName"
              label={metric.name}
              value={metric.name}
              onChange={this.handleChange}
              checked={metric.name === this.props.metricName}
            />
          </div>
        ))}
      </Form.Group>
      );
    }
  }
}

export default Step2;