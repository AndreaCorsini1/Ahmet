/**
 *
 */
import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <Container className="footer">
          <p className="copyright pull-right">
              Project by Andrea Corsini & Matteo Canalini. Made with React.
          </p>
      </Container>
    );
  }
}

export default Footer;
