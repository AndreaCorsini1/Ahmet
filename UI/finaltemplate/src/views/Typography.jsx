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
import {Grid, Row, Col, Table} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { Tasksmodel } from "../components/Tasks/Tasksmodel";
import {value, recap} from "variables/Variables.jsx";
import {Taskdataset} from "../components/Tasks/Taskdataset";
import {TasksParameter} from "../components/Tasks/TasksParameter";
import FormControlStatic from "react-bootstrap/lib/FormControlStatic";

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
    const { algorithm, metrics, dataset, parameter } = this.state;
      alert(`Your registration detail: \n
           Algorithm: ${recap.algorithm} \n 
           Metrics: ${value.name_model} \n
           Dataset: ${recap.dataset} \n
           Parameter: ${recap.parameter} \n`)
  }

  _next = () => {

    //qua dentro devi fare tutti case per leggere api, aggiori le var globali con risposta api e via


    let currentStep = this.state.currentStep;

      //controllo su ogni step per vedere se è stato inserito un campo

      if (this.state.algorithm == ''&& this.state.currentStep == 1){
          alert("insert alg before procede");
           this.setState({
                currentStep: currentStep
        })
      }
    else if (currentStep < 5)
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
          algorithm={this.state.algorithm}
          dataset={this.state.dataset}
          metrics={this.state.metrics}
        />
        <Step4
          currentStep={this.state.currentStep}
          handleChange={this.handleChange}
          algorithm={this.state.algorithm}
          dataset={this.state.dataset}
          metrics={this.state.metrics}
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

  //inserisco alg
    recap.algorithm = props.algorithm;

  return(
    <div className="content">
      <label htmlFor="username">Algorithm: {recap.algorithm}</label>
        <Col>
               <Card
                content={
                  <div className="table-full-width">
                      <p> Choose a metrics for : {props.algorithm}</p>
                    <table className="table">
                      <Tasksmodel metrics={props}/>
                    </table>
                  </div>
                }/>
            </Col>
    </div>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null
  }

  //alert("modello selto typo: " + value.name_model);
    //inserisco il modello scelto
    recap.metrics = value.name_model;
    //value.name_model;

  return(
    <div className="content">
      <label htmlFor="username">Algorithm: {recap.algorithm} -> Metrics: {recap.metrics}</label>
        <Col>
               <Card
                content={
                  <div className="table-full-width">
                      <p> Choose a dataset for : {recap.metrics}</p>
                    <table className="table">
                      <Taskdataset dataset={props}/>
                    </table>
                  </div>
                }/>
            </Col>
    </div>
  );
}

function Step4 (props){
  if (props.currentStep !== 4) {
    return null
  }

  recap.dataset = value.name_dataset;

   return(
    <div className="content">
      <label htmlFor="username">Algorithm: {recap.algorithm} -> Metrics: {recap.metrics} -> Dataset: {recap.dataset}</label>
        <Col>
               <Card
                content={
                  <div className="table-full-width">
                      <p> Choose a parameter for : {recap.dataset}</p>
                    <table className="table">
                      <TasksParameter parameter={props}/>
                    </table>
                  </div>
                }/>
            </Col>
    </div>
  );
}


function Step5 (props){
  if (props.currentStep !== 5) {
    return null
  }

  recap.parameter = value.name_param;

   return(

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
                            <th>Algorithm : {recap.algorithm}</th>
                        </tr>
                        <tr>
                            <th>Metrics : {recap.metrics}</th>
                        </tr>
                        <tr>
                            <th>Dataset : {recap.dataset}</th>
                        </tr>
                        <tr>
                            <th>Parameter : {recap.parameter}</th>
                        </tr>
                        </thead>
                    </Table>
                }
                />
            </Col>
          </Row>
       </Grid>

    <button className="btn btn-success btn-block">Submit a study</button>
    </React.Fragment>
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

