/**
 *
 */
import React from "react";
import {Form} from "react-bootstrap";
import Loading from "../Loading/Loading";
import Card from "../Card/Card";
import ErrorView from "../Errors/Error";

/**
 * First subview for filling the study name.
 */
class Step0 extends React.Component {
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

  handleChange(event) {
    let {name, value} = event.target;
    this.props.handleChange({
      name: name,
      value: value
    })
  }

  render() {
    if (this.state.error) {
      console.error(this.state.error.message);
      return (<ErrorView message={this.state.error.message} />);
    } else if (!this.state.isLoaded) {
      return <Loading />;
    } else {
      return (
        <Card
          title="Fill in the study name and press next to compose the study."
          content={
            <Form.Control
              className="form-control"
              id="studyName"
              name="studyName"
              placeholder="Type study name..."
              value={this.props.studyName}
              onChange={this.handleChange}
            />
          }
        />
      );
    }
  }
}

export default Step0