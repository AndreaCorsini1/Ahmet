/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import {store} from "react-notifications-component";
import Loading from "../Loading/Loading";

/**
 * Select the dataset.
 */
class Step3 extends React.Component {
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
    let uri = this.props.uri + this.props.metric + '/';
    fetch(uri, this.state.options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299)
          return response.json();
        throw Error(response.statusText)
      })
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            results: data.datasets
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

  handleChange(event) {
    let {name, value} = event.target;
    this.props.handleChange({
      name: name,
      value: value
    })
  }

  render() {
    // TODO: change dataset id into name
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
      <Form.Group controlId="datasetName">
        <h3> Choose a dataset: </h3>
        {this.state.results.map((dataset) => (
          <div key={`dataset-${dataset}`} className="mb-3">
            <Form.Check
              type='checkbox'
              name="datasetName"
              label={dataset}
              value={dataset}
              onChange={this.handleChange}
              checked={dataset == this.props.datasetName}
            />
          </div>
        ))}
      </Form.Group>
      );
    }
  }
}

export default Step3;