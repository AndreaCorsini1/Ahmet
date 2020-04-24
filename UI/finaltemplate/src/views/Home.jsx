/**
 * Homepage, add stuff.
 */
import React, {Component} from "react";
import {Container} from "react-bootstrap";

class Home extends Component {
  render() {
    return (
      <div className="content">
        <Container fluid>
          <h3>What is Ahmet?</h3>
          Framework for black-box optimization.
          <hr/>
          <h3>Useful definitions</h3>
          <ul>
            <li>Trial: a list of parameters value that will be evaluated against the metric.</li>
            <li>Metric: a machine learning model representing the black box function.</li>
            <li>Study: entity composed of a BBO algorithm, a metric and the trials.</li>
            <li>Worker: a process or a thread responsible of evaluating a trial x.</li>
            <li>Run: a complete optimization execution of the problem.</li>
          </ul>
        </Container>
      </div>
    );
  }
}

export default Home;
