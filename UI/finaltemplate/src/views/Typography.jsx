/*!

link code : https://css-tricks.com/the-magic-of-react-based-multi-step-forms/

*/
import React, { Component } from "react";
import {Grid, Row, Col, Table} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { Tasksmodel } from "../components/Tasks/Tasksmodel";
import {Taskdataset} from "../components/Tasks/Taskdataset";
import {TasksParameter} from "../components/Tasks/TasksParameter";
import FormControlStatic from "react-bootstrap/lib/FormControlStatic";

class Typography extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      studyName: 'study',
      algorithmName: 'defaultAlgorithm',
      metricName: 'defaultMetric',
      datasetName: 'defaultDataset',
      parameters: 'defaultParameters',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    // TODO: call api
    const { algorithm, metrics, dataset, parameters } = this.state;
    alert("Your registration detail for study {this.state.studyName}: \n " +
        "Algorithm: {algorithm} \n " +
        "Metrics: {metrics} \n " +
        "Dataset: {dataset} \n " +
        "Parameter: {parameters} \n"
    );
  }

  _next() {
    let currentStep = this.state.currentStep;
    if (currentStep < 5)
      currentStep = currentStep + 1;

    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 0)
        currentStep = currentStep -1;

    this.setState({
      currentStep: currentStep
    });
  }

  previousButton() {
    let currentStep = this.state.currentStep;
    if(currentStep !==0){
      return (
        <button
          className="btn btn-secondary"
          type="button"
          onClick={this._prev}
        >
          Previous
        </button>
      );
    }
    return null;
  }

  nextButton(){
    let currentStep = this.state.currentStep;
    if(currentStep < 5){
      return (
        <button
          className="btn btn-primary float-right"
          type="button"
          onClick={this._next}
        >
          Next
        </button>
      );
    }
    return null;
  }

  summary() {
    return (
      <React.Fragment>
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Recap of your study to submit"
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
                        <th>Parameter : {this.state.parameters}</th>
                      </tr>
                    </thead>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
        <button className="btn btn-success btn-block">
          Submit the study
        </button>
      </React.Fragment>
    );
  }

  renderStep() {
    switch (this.state.currentStep) {
      case 0:
        return (<Step0
          handleChange={this.handleChange}
          newStudy={this.state.newStudy}
        />);
      case 1:
        return (<Step1
          handleChange={this.handleChange}
          algorithmName={this.state.algorithmName}
        />);
      case 2:
        return (<Step2
          handleChange={this.handleChange}
          metricName={this.state.metricName}
        />);
      case 3:
        return (<Step3
          handleChange={this.handleChange}
          datasetName={this.state.datasetName}
        />);
      case 4:
        return (<Step4
          handleChange={this.handleChange}
          parameters={this.state.parameters}
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
    return (
      <React.Fragment>
        <h1>Insert data for create a new study️</h1>
        <form onSubmit={this.handleSubmit}>
          {this.showRecap()}
          {this.renderStep()}
          {this.previousButton()}
          {this.nextButton()}
        </form>
      </React.Fragment>
    );
  }
}

/**
 * First subview for filling the study name.
 *
 * @param props
 * @returns {*}
 */
function Step0(props) {
  return(
    <div className="form-group">
      <label htmlFor="email">
        Fill in the study name and press next to compose the study.
      </label>
      <input
        className="form-control"
        id="studyName"
        name="studyName"
        type="text"
        placeholder="study"
        value={props.studyName}
        onChange={props.handleChange}
      />
    </div>
  );
}

/**
 * Select the algorithm.
 *
 * @param props
 * @returns {*}
 */
function Step1(props) {
  // TODO: Add HTTP request for algorithm list
  return (
    <div className="form-group">
      <label htmlFor="email">Choose an algorithm</label>
      <input
        className="form-control"
        id="algorithmName"
        name="algorithmName"
        type="text"
        placeholder="algorithm"
        value={props.algorithmName}
        onChange={props.handleChange}
      />
    </div>
  );
}

/**
 * Select the metric.
 *
 * @param props
 * @returns {null|*}
 */
function Step2(props) {
  // TODO: Add HTTP request for metric list
  return(
    <div className="content">
      <Col>
        <Card
          content={
            <div className="table-full-width">
              <p> Choose a metrics for </p>
              <table className="table">
                <Tasksmodel metrics={props}/>
              </table>
            </div>
          }/>
        </Col>
    </div>
  );
}

/**
 * Select the dataset.
 *
 * @param props
 * @returns {*}
 */
function Step3(props) {
 // TODO: Add HTTP request for dataset list
 return(
   <div className="content">
       <Col>
         <Card
           content={
             <div className="table-full-width">
               <p> Choose a dataset</p>
               <table className="table">
                 <Taskdataset dataset={props}/>
               </table>
             </div>
           }/>
       </Col>
    </div>
  );
}

/**
 * Select the parameters.
 *
 * @param props
 * @returns {*}
 */
function Step4 (props){
 // TODO: Add HTTP request for parameters list
 return(
   <div className="content">
     <Col>
       <Card
         content={
           <div className="table-full-width">
             <p> Choose a parameter </p>
             <table className="table">
               <TasksParameter parameter={props}/>
             </table>
           </div>
         }/>
     </Col>
    </div>
  );
}

export default Typography;

/*<React.Fragment>
<FormControlStatic className="content">
  <label htmlFor="password">Recap for current study</label>

    <FormControlStatic>

        Algorithm : {recap.algorithm} \n
        Metrics : {recap.metrics} \n
        Dataset : {recap.dataset} \n
        Parameter : {recap.parameter}

    </FormControlStatic>

</FormControlStatic>*/