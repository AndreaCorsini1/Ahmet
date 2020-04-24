/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import Loading from "../Loading/Loading";
import Card from "../Card/Card"
import ErrorView from "../Errors/Error";

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
      return (<ErrorView message={this.state.error.message} />);
    } else if (!this.state.isLoaded) {
      return (<Loading />);
    } else {
      return (
        <Card
          title="Choose a dataset:"
          content={this.state.results.map((dataset) => (
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
        />
      );
    }
  }
}

export default Step3;