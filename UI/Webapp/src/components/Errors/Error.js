/**
 * Error component.
 */
import React from "react";
import {Container, Col} from "react-bootstrap";
import {store} from "react-notifications-component";
import { NavLink } from "react-router-dom";

class ErrorView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    store.addNotification({
      title: "Error",
      message: this.props.message,
      type: "danger",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {duration: 5000}
    });
    console.log(this.props.message);

    return (
      <div className="content">
        <Container fluid>
          <Col className="text-center">
            <h2 className="font-weight-light"> Oops! </h2>
            <h4>Something went wrong.</h4>
            <NavLink to="/home">
              Go home
            </NavLink>
          </Col>
        </Container>
      </div>
    );
  }
}

export default ErrorView
