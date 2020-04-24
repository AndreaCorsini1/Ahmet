/**
 * Needs you Matte.
 */
import React, { Component } from "react";
import {Container, Row, Col} from "react-bootstrap";
import StatsCard from "components/StatsCard/StatsCard.jsx";
import Select from 'react-select';
import {Polar} from "react-chartjs-2";
import CategoricalPolar from "../components/Charts/CategoricalPolar";
import ContinuousHistogram from "../components/Charts/ContinuousHistogram";
import Loading from "../components/Loading/Loading";
import Card from "../components/Card/Card";

const data = {
  datasets: [{
    data: [
      11,
      16,
      7,
      3
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'Greed Search',
    'Random Search',
    'Baeysian Optimization',
    'Scatter Search'
  ]
};

const data_metrics = {
  datasets: [{
    data: [
      23,
      3,
      18,
      10
    ],
    backgroundColor: [
      '#FF6384',
      '#4BC0C0',
      '#FFCE56',
      '#E7E9ED'
    ],
    label: 'My dataset' // for legend
  }],
  labels: [
    'KNN',
    'Random Forest',
    'Simple Function',
    'SVM'
  ]
};

class Statistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: true,
      studySelected: null,
      studies: [],
      trials: [],
      runningStudies: 1
    }
    this.handleChange = this.handleChange.bind(this);
  }

  fetchStudies(study) {
    let uri = "http://localhost:8080/api/v0.1/studies/"
    if (study !== null)
        uri += study + '/'

    // TODO: add fetch to backend
    let list_studies = [];
    for (let i=0; i !== 12; i++) {
        var myCopiedArray = {
            label: "studio " + i,
            value: i
        };
        list_studies.push(myCopiedArray);
    }
    return list_studies;
  }

  fetchTrials(study) {
    let list_trials = ['bla', 'bla']
    let uri = "http://localhost:8080/api/v0.1/trials/"
    if (study !== null)
        uri += study + "/trials/";

    // TODO: add fetch

    return list_trials;
  }

  componentDidMount() {
    let studies = this.fetchStudies();
    let trials = this.fetchTrials();

    this.setState({
        isFetching: false,
        studies: studies,
        trials: trials
    })
  }

  charts(){
    //TODO: switch sul tipo di studio => per cat & discreti/interval
    //numb_param = numero di parametri = numero di grafici da fare

      //dati_iper => dati test per categorical
      const dati_iper = [
          {iper_nome: 'hidden1',value:[1,2,3,4], attempt: [2,6,10,24]},
          {iper_nome: 'gamma', value:[0.2, 3, 0.02, 8], attempt: [1, 8, 5, 15]},
          {iper_nome: 'delta', value:[0.001, 0.02, 0.05, 0.006], attempt: [4, 4, 5, 23]},
          {iper_nome: 'omega', value:[0.001, 0.02, 0.05, 0.006, 0.43, 0.65], attempt: [4, 4, 5, 23, 6, 7]}];

      //dati_cont => dati test continue
      const dati_cont = [
          {iper_nome : 'cont 1',inter:[1,10], attempt: [1,1,1,2,2,2,10,10,10]},
          {iper_nome: 'cont 2', inter:[0.2,1], attempt: [0.2,0.2,1,1,1,0.2,1,1,0.5,0.5]},
          {iper_nome: 'cont 3', inter:[2,6], attempt: [2.5,5.59,5.87,4,4.32,3.46,3.98,5.557,6,4.99]},
          {iper_nome: 'cont 4', inter:[4,8], attempt: [4.99,6,6,6.65,4.5,7,7.98,8,6.88,5.99,4.76,7.99,6.98]}];

      switch(this.state.studySelected){
        case "studio 1":
          return(
              <CategoricalPolar
                  label = {this.state.studySelected}
                  numb_param = {4}
                  dati_iper_try = {dati_iper}
              />
          );
        case "studio 2":
           return(
              <CategoricalPolar
                  label = {this.state.studySelected}
                  numb_param = {4}
                  dati_iper_try = {dati_iper}
              />
          );
        case "studio 3":
           return(
              <ContinuousHistogram
                  label = {this.state.studySelected}
                  numb_param = {4}
                  dati_iper_try = {dati_cont}
              />
           );
          default:
            return (
              <div>
                <h2>Algorithms Usage</h2>
                <Polar data={data} />
                <h2>Metrics Usage</h2>
                <Polar data={data_metrics} />
              </div>
            );
      }
  };

  handleChange (event) {
    if (event === null) {
      this.setState({studySelected: null})
    } else {
      let {label} = event;
      this.setState({studySelected: label});
    }
  };

  render() {
    if (this.state.isFetching)
      return <Loading text="Fetching data..."/>;
    return (
      <div className="content">
        <Container fluid>
          <Col className="text-center">
            <h2>Analytics about studies</h2>
            <hr/>
          </Col>
          <Row className="justify-content-center">
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Number of studies"
                statsValue = {this.state.studies.length}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Number of trials"
                statsValue={this.state.trials.length}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Running studies"
                statsValue={this.state.runningStudies}
              />
            </Col>
          </Row>
          <Col className="justify-content-center">
            <Card
              hcenter
              title="Select a study for getting its charts"
              content={
                <Select className="mt-4 col-offset-4"
                  onChange={this.handleChange}
                  options= {this.state.studies}
                  isClearable={true}
                  placeholder="Choose a study"
                />
              }
            />
            { this.charts() }
          </Col>
        </Container>
      </div>
    );
  }
}

export default Statistics;