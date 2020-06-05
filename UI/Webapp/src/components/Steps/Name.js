/**
 *
 */
import React from "react";
import { Form } from "react-bootstrap";
import Loading from "../Loading/Loading";
import CustomCard from "../Cards/CardBootstrap";
import ErrorView from "../Errors/Error";
import { APIGet } from "../Fetcher/Fetcher";
import {store} from "react-notifications-component";


/**
 * First subview for filling the study name.
 */
class Name extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        error: null,
        isLoaded: false,
        studies: [],
        name: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded: true,
          studies: studies.map((study) => (study.name))
        });
      },
      onError: (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      },
      uri: this.props.uri,
    });
  }

  handleChange(event) {
    let {value} = event.target;
    this.setState({name: value});

    if (this.state.studies.includes(value)) {
      store.addNotification({
        title: "Invalid name", type: "danger",
        message: `Name: ${value} already exists.`,
        insert: "top", container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 }
      });
    } else {
      this.props.handleChange(value);
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorView message={this.state.error.message} />;
    } else if (!this.state.isLoaded) {
      return <Loading />;
    } else {
      return (
        <CustomCard
          title="Study name:"
          subtitle="Fill in the study name and click next to compose the study"
          content={
            <Form.Control
              id="studyName"
              name={this.props.name}
              placeholder="Type a study name..."
              value={this.state.value}
              onChange={this.handleChange}
            />
          }
        />
      );
    }
  }
}

export default Name