/**
 *
 */
import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
          <p className="copyright pull-right">
              Project created by Corsini Andrea & Canalini Matteo, made with React
          </p>
      </footer>
    );
  }
}

export default Footer;


/*
for a link at the bottom page

<p className="copyright pull-right">
            <a href="http://www.creative-tim.com?ref=lbr-footer">
              Project created by Corsini Andrea & Canalini Matteo
            </a>
            , made with React
          </p>
"*/
