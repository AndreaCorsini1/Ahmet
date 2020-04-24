/**
 *
 * link code : https://css-tricks.com/the-magic-of-react-based-multi-step-forms/
 *
 * TODO: add validation
 */
import React, { Component } from "react";
import { Row, Col, Table, Form, Container} from "react-bootstrap";
import Card from "../components/Card/Card";
import Step0 from "../components/Steps/Step0";
import Step1 from "../components/Steps/Step1";
import Step2 from "../components/Steps/Step2";
import Step3 from "../components/Steps/Step3";
import Step4 from "../components/Steps/Step4";
import Loading from "../components/Loading/Loading";
import getToken from "../components/Token/Token";

const steps = ['studyName', 'algorithmName', 'metricName', 'datasetName', 'parameters'];
class NewStudy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      studyName: null,
      algorithmName: null,
      metricName: null,
      datasetName: null,
      parameters: null,
      token: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({token: token})
      }
    });
  }

  handleChange(event) {
    const {name, value} = event;
    this.setState({
      [name]: value
    });
  }

  handleKeyPress(event) {
    console.log(event.key);
    if (event.key === 'Enter') {
      this._next();
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    // TODO: call api
    let uri = "http://localhost:8080/api/v0.1/studies/";
    let options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
      },
      body: JSON.stringify()
    };
    console.log(this.state);
  }

  _next() {
    let currentStep = this.state.currentStep;
    let key = steps[currentStep].name;

    if (currentStep < 5 && this.state[key] !== null) {
      currentStep = currentStep + 1;
      this.setState({
        currentStep: currentStep
      });
    }
  }

  _prev() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 0) {
      currentStep = currentStep - 1;
      this.setState({
        currentStep: currentStep
      });
    }
  }

  previousButton() {
    let currentStep = this.state.currentStep;
    if(currentStep !== 0){
      return (
        <button
          className="btn btn-secondary float-left"
          type="button"
          onClick={this._prev}
        >
          Previous
        </button>
      );
    }
  }

  nextButton(){
    if (this.state.currentStep < 5) {
      let key = steps[this.state.currentStep];
      return (
        <button
          className="btn btn-primary float-right"
          type="button"
          disabled={this.state[key] == null}
          onClick={this._next}
        >
          Next
        </button>
      );
    }
    return (
      <button
          className="btn btn-success float-right"
          type="button"
          onClick={this.handleSubmit}
      >
        Submit
      </button>
    );
  }

  summary() {
    let title = "Recap of " + this.state.studyName;
    return (
      <Card
        title={title}
        ctTableFullWidth
        ctTableResponsive
        content={
          <Table striped hover>
            <thead>
              <tr>
                <th>Algorithm : {this.state.algorithmName}</th>
              </tr>
              <tr>
                <th>Metrics : {this.state.metricName}</th>
              </tr>
              <tr>
                <th>Dataset : {this.state.datasetName}</th>
              </tr>
              <tr>
                <th>Parameter : {JSON.stringify(this.state.parameters)}</th>
              </tr>
            </thead>
          </Table>
        }
      />
    );
  }

  renderStep() {
    switch (this.state.currentStep) {
      case 0:
        return (<Step0
          handleChange={this.handleChange}
          newStudy={this.state.newStudy}
          uri="http://localhost:8080/api/v0.1/studies/"
          token={this.state.token}
        />);
      case 1:
        return (<Step1
          handleChange={this.handleChange}
          algorithmName={this.state.algorithmName}
          uri="http://localhost:8080/api/v0.1/algorithms/"
          token={this.state.token}
        />);
      case 2:
        return (<Step2
          handleChange={this.handleChange}
          metricName={this.state.metricName}
          uri="http://localhost:8080/api/v0.1/metrics/"
          token={this.state.token}
        />);
      case 3:
        return (<Step3
          handleChange={this.handleChange}
          datasetName={this.state.datasetName}
          metric={this.state.metricName}
          uri="http://localhost:8080/api/v0.1/metrics/"
          token={this.state.token}
        />);
      case 4:
        return (<Step4
          handleChange={this.handleChange}
          parameters={this.state.parameters}
          metric={this.state.metricName}
          uri="http://localhost:8080/api/v0.1/metrics/"
          token={this.state.token}
        />);
      default:
        return (this.summary());
    }
  }

  showRecap() {
    switch (this.state.currentStep) {
      case 2:
        return (
          <label htmlFor="username">
              Algorithm: {this.state.algorithmName}
          </label>
        );
      case 3:
        return (
          <label htmlFor="username">
              Algorithm: {this.state.algorithmName} -> Metric: {this.state.metricName}
          </label>
        );
      case 4:
        return (
          <label htmlFor="username">
            Algorithm: {this.state.algorithmName} -> Metric: {this.state.metricName} -> Dataset: {this.state.datasetName}
          </label>
        );
    }
  }

  render() {
    if (!this.state.token)
      return <Loading />;
    let name = this.state.studyName || 'a new study';
    return (
      <div className="content">
        <Container fluid>
          <Form>
            <Form.Group as={Col} className="text-center">
              <h2> Insert data for creating {name} ️</h2>
              <hr/>
              {this.showRecap()}
            </Form.Group>
            <Form.Row className="text-center">
              <Col> {this.renderStep()} </Col>
            </Form.Row>
            <Row>
              <Col> {this.previousButton()} </Col>
              <Col> {this.nextButton()} </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

export default NewStudy;