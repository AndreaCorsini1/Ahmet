/**
 *
 */
import React from "react";
import {Form} from "react-bootstrap";
import {store} from "react-notifications-component";
import Loading from "../Loading/Loading";

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
        <Form.Group controlId="studyName">
          <h3>
            Fill in the study name and press next to compose the study.
          </h3>
          <Form.Control
            className="form-control"
            id="studyName"
            name="studyName"
            placeholder="Study"
            value={this.props.studyName}
            onChange={this.handleChange}
          />
        </Form.Group>
      );
    }
  }
}

export default Step0