/**
 * Multi-step form for composing a new study.
 *
 * link: https://css-tricks.com/the-magic-of-react-based-multi-step-forms/
 */
import React, { Component } from "react";
import { Row, Col, Table, Form, Container, ProgressBar, Button} from "react-bootstrap";
import CustomCard from "../components/Cards/CardBootstrap";
import Name from "../components/Steps/Name";
import Algorithm from "../components/Steps/Algorithm";
import Metric from "../components/Steps/Metric";
import Dataset from "../components/Steps/Dataset";
import Parameters from "../components/Steps/Parameters";
import Loading from "../components/Loading/Loading";
import getToken from "../components/Token/Token";
import ErrorView from "../components/Errors/Error";
import {store} from "react-notifications-component";
import {APIPost} from "../components/Fetcher/Fetcher";
import {Redirect} from "react-router-dom";

// Form settings
const steps = ['Name', 'Algorithm', 'Metric', 'Dataset', 'Parameters'];
const variants = ['success', 'danger', 'warning', 'info', 'primary'];

class NewStudy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      Name: null,
      Algorithm: null,
      Metric: null,
      Dataset: null,
      Parameters: null,
      token: null,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  /**
   * Get the token.
   *
   * TODO: remove with login
   */
  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({
          token: token
        });
      }
    });
  }

  /**
   * Handle all the changes in the multi-step form.
   */
  handleChange(data) {
    let key = steps[this.state.currentStep];
    let update = {[key]: data};

    // Special behaviour for metric
    if (this.state.currentStep === 2) {
      // Flush all the study data following metric
      for (let i = this.state.currentStep + 1; i < steps.length; i++) {
        update[steps[i]] = null;
      }
      // When the metric does not support any dataset, it does not need
      // dataset at all
      if (!data.dataset || data.dataset.length === 0) {
        update[steps[3]] = {
          id: null,
          name: 'No dataset'
        };
      }
    }
    this.setState(update);
  }

  /**
   * Handle error in fetching operations.
   *
   * @param error: error object coming from the API fetcher
   */
  handleError(error) {
    console.log(error);
    this.setState({
      isLoaded: true,
      error: error
    });
  }

  /**
   *
   */
  handleSubmit() {
    let data = {
      name: this.state.Name,
      algorithm_id: this.state.Algorithm.id,
      metric_id: this.state.Metric.id,
      runs: this.state.Algorithm.runs,
      num_suggestions: this.state.Algorithm.suggestions
    };
    // Include dataset only if needed
    if (this.state.Dataset.id)
      data['dataset_id'] = this.state.Dataset.id;

    APIPost({
      data: data,
      onSuccess: () => {
        let study = this.state.Name;
        let keys = Object.keys(this.state.Parameters);
        keys.map((key) => this.submitParameters(study, key));
      },
      onError: this.handleError,
      uri: "http://localhost:8080/api/v0.1/studies/",
      token: this.state.token
    });
  }

  /**
   * Post the selected parameter for a study.
   *
   * @param study: study identifier.
   * @param key: parameter key.
   */
  submitParameters(study, key) {
    let param = this.state.Parameters[key];
    let data = {
      name: key,
      study: study,
      ...param
    };

    APIPost({
      data: data,
      onSuccess: (data) => {
        store.addNotification({
          title: "Submitted successfully",
          message: `The study: ${this.state.Name} has been correctly received`,
          type: "success",
          insert: "top", container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 }
        });
      },
      onError: this.handleError,
      uri: "http://localhost:8080/api/v0.1/parameters/",
      token: this.state.token
    });
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
        <Button
          className="float-left" variant="secondary"
          onClick={this._prev}
        >
          Previous
        </Button>
      );
    }
  }

  nextButton(){
    if (this.state.currentStep < 5) {
      let key = steps[this.state.currentStep];
      return (
        <Button
          className="float-right"
          disabled={this.state[key] == null}
          onClick={this._next}
        >
          Next
        </Button>
      );
    }
    return (
      <Button
        className="float-right" variant="success"
        onClick={this.handleSubmit}
      >
        Submit
      </Button>
    );
  }

  summary() {
    return (
      <CustomCard
        title={`Recap of ${this.state.Name}`}
        content={
          <Table striped hover>
            <thead>
              <tr>
                <th>Algorithm : {this.state.Algorithm.name}</th>
              </tr>
              <tr>
                <th>Metrics : {this.state.Metric.name}</th>
              </tr>
              <tr>
                <th>Dataset : {this.state.Dataset.name}</th>
              </tr>
              <tr>
                <th>Parameter : {JSON.stringify(this.state.Parameters)}</th>
              </tr>
            </thead>
          </Table>
        }
      />
    );
  }

  /**
   * Render the current step of the form.
   *
   * @returns {*}
   */
  renderStep() {
    switch (this.state.currentStep) {
      case 0:
        return (<Name
          value={this.state.Name} uri="http://localhost:8080/api/v0.1/studies/"
          token={this.state.token} handleChange={this.handleChange}
        />);
      case 1:
        return (<Algorithm
          value={this.state.Algorithm}
          uri="http://localhost:8080/api/v0.1/algorithms/"
          token={this.state.token} handleChange={this.handleChange}
        />);
      case 2:
        return (<Metric
          value={this.state.Metric} uri="http://localhost:8080/api/v0.1/metrics/"
          token={this.state.token} handleChange={this.handleChange}
        />);
      case 3:
        return (<Dataset
          value={this.state.Dataset} types={this.state.Metric.dataset}
          uri="http://localhost:8080/api/v0.1/datasets/"
          token={this.state.token} handleChange={this.handleChange}
        />);
      case 4:
        return (<Parameters
          value={this.state.Parameters} space={this.state.Metric.space}
          token={this.state.token} handleChange={this.handleChange}
        />);
      default:
        return (this.summary());
    }
  }

  /**
   * Show the current step of the form in the progress bar/stepper.
   *
   * @returns {*}
   */
  stepper() {
    let elements = []

    for (let i = 0; i <= this.state.currentStep && i < steps.length; i++) {
      elements.push(<ProgressBar
        striped
        now={20}
        label={steps[i]}
        variant={variants[i]}
        key={i}
      />);
    }
    return <ProgressBar> {elements} </ProgressBar>;
  }

  render() {
    if (!this.state.token)
      return <Loading />;

    else if (this.state.error)
      return (<ErrorView message={this.state.error.message} />);

    let name = this.state.Name || 'a new study';
    return (
      <div className="content">
        <Container fluid>
          <Form>
            <Form.Group as={Col} className="text-center">
              <h2> Insert data for creating {name} ️</h2>
              <hr/>
              {this.stepper()}
            </Form.Group>
            <Form.Row className="text-center">
              <Col> <Container> {this.renderStep()} </Container> </Col>
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