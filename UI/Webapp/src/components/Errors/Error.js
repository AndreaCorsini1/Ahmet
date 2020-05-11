import React from "react";
import {Button, Container, Col} from "react-bootstrap";
import {store} from "react-notifications-component";

// TODO
function ErrorView(props) {
  store.addNotification({
    title: "Error",
    message: props.message,
    type: "danger",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: { duration: 5000 }
  });
  console.log(props.message);

  return (
    <Container fluid>
      <Col className="text-center">
        <h2> Oops! </h2>
        <h4> Something went wrong </h4>
        <Button> Go home </Button>
      </Col>
    </Container>
  );
}

export default ErrorView
