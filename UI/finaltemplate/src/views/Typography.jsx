/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


link code : https://css-tricks.com/the-magic-of-react-based-multi-step-forms/


*/

import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Tasksmodel } from "components/Tasks/Tasksmodel.jsx";

import Card from "components/Card/Card.jsx";
import {TasksParameter} from "../components/Tasks/TasksParameter";

class Typography extends Component {
constructor(props) {
    super(props)
    this.state = {
      currentStep: 0,
      newstudy: '',
      algorithm: '',
      metrics: '',
      dataset: '',
      parameter: '',
      recap: '',
    }
  }

  handleChange = event => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    const { newstudy, algorithm, metrics, dataset, parameter, recap } = this.state
    alert(`Your registration detail: \n 
           Newstudy: ${newstudy} \n
           Algorithm: ${algorithm} \n 
           Metrics: ${metrics} \n
           Dataset: ${dataset} \n
           Parameter: ${parameter} \n
           Recap: ${recap}`)
  }

  _next = () => {
    let currentStep = this.state.currentStep
    if (currentStep < 5)
      currentStep = currentStep + 1;
    this.setState({
      currentStep: currentStep
    })
      //alert("premuto next")
  }

  _prev = () => {
    let currentStep = this.state.currentStep
    if (currentStep != 0)
        currentStep = currentStep -1;
    this.setState({
      currentStep: currentStep
    })
      //alert("premuto previus")
  }

/*
* the functions for our button
*/
previousButton() {
  let currentStep = this.state.currentStep;
  if(currentStep !==0){
    return (
      <button
        className="btn btn-secondary"
        type="button" onClick={this._prev}>
      Previous
      </button>
    )
  }
  return null;
}

nextButton(){
  let currentStep = this.state.currentStep;
  if(currentStep < 5){
    return (
      <button
        className="btn btn-primary float-right"
        type="button" onClick={this._next}>
      Next
      </button>
    )
  }
  return null;
}

  render() {
    return (
      <React.Fragment>
      <h1>Insert data for create a new study️</h1>

      <form onSubmit={this.handleSubmit}>
      {/*
        render the form steps and pass required props in
      */
      }

       <Step0
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          newstudy={this.state.newstudy}
        />
        <Step1
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          algorithm={this.state.algorithm}
        />
        <Step2
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          algorithm={this.state.algorithm}
          metrics={this.state.metrics}
        />
        <Step3
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          dataset={this.state.dataset}
        />
        <Step4
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          parameter={this.state.parameter}
        />
        <Step5
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          recap={this.state.recap}
        />

        {this.previousButton()}
        {this.nextButton()}

      </form>
      </React.Fragment>
    );
  }
}

function Step0 (props){
  if (props.currentStep !== 0) {
    return null
  }
   return(
    <div className="form-group">
        <label htmlFor="email">Press next to start a new study</label>
    </div>
  );
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null
  }

  return(
    <div className="form-group">
      <label htmlFor="email">Insert an algorithm</label>
      <input
        className="form-control"
        id="algorithm"
        name="algorithm"
        type="text"
        placeholder="Algorithm"
        value={props.algorithm}
        onChange={props.handleChange}
        />
    </div>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null
  }

  var al = JSON.stringify(props);
  //var test = JSON.parse(props);
  //alert(al);
  //alert('props: ' + JSON.stringify(props));
  //alert(al);
  alert(al[0]);

  return(
    <div className="content">
      <label htmlFor="username">Choose a Metrics</label>
        <Col /*md={4}*/>
               <Card
                //title="Choice of parameter for the current model"
                category={"choose a metrics for: " + { al } }
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <TasksParameter />
                    </table>
                  </div>
                }
              />
            </Col>

    </div>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null
  }
  return(
    <React.Fragment>
    <div className="content">
      <label htmlFor="password">Dataset</label>
      <input
        className="form-control"
        id="dataset"
        name="dataset"
        type="text"
        placeholder="Dataset"
        value={props.dataset}
        onChange={props.handleChange}
        />
    </div>
    </React.Fragment>
  );
}

function Step4 (props){
  if (props.currentStep !== 4) {
    return null
  }
   return(
    <React.Fragment>
    <div className="content">
      <label htmlFor="password">parameter</label>
      <input
        className="form-control"
        id="parameter"
        name="parameter"
        type="text"
        placeholder="Parameter"
        value={props.parameter}
        onChange={props.handleChange}
        />
    </div>
    </React.Fragment>
  );
}


function Step5 (props){
  if (props.currentStep !== 5) {
    return null
  }
   return(
    <React.Fragment>
    <div className="content">
      <label htmlFor="password">recap</label>
      <input
        className="form-control"
        id="recap"
        name="recap"
        type="text"
        placeholder="Recap"
        value={props.recap}
        onChange={props.handleChange}
        />
    </div>
    <button className="btn btn-success btn-block">Submit a study</button>
    </React.Fragment>
  );
}

export default Typography;

