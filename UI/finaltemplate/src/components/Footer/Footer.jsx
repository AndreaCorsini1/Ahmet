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
              Project created by Corsini Andrea & Canalini Matteo, made with React
          </p>
      </Container>
    );
  }
}

export default Footer;
