/**
 * Needs you Matte.
 */
import React, { Component } from "react";
import {Container, Row, Col, Dropdown, Form} from "react-bootstrap";
import StatsCard from "components/StatsCard/StatsCard.jsx";
import Select from 'react-select';
import {Polar} from "react-chartjs-2";
import ExplodeCategorical from "../components/ExplodeStatistics/ExplodeCategorical.js";
import ExplodeContinue from "../components/ExplodeStatistics/ExplodeContinue";

import {
  Nstudy,
  Nrunning,
} from "variables/Variables.jsx";


var test = [
    {   label: "studio 1", value: 1},
    {   label: "studio 2", value : 2},
    {   label: "studio 3", value: 3},
    {   label: "studio 4", value: 4},
    {   label: "studio 5", value: 5},
    {   label: "studio 6", value: 6}
];

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

let tech = [];

const Open = () => {
    //TODO: get su api degli studi finiti, dopo vengono inseriti in struttura test
    alert("Aggiornamento studi");

    let i;

    for (i=0; i!== 20; i++) {

        var myCopiedArray = {label:'', value:0};
        myCopiedArray.label = "studio " + i;
        myCopiedArray.value = i;
        tech.push(myCopiedArray);
    }
    //alert(JSON.stringify(tech));
};

class Statistics extends Component {
    constructor(props) {
        super(props)
        {
            this.state = {
                selectedOption: 'ciao'
            }
        }
        this.handleExplode = this.handleExplode.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //bottone aggiuntivo se vogliamo seconda pagina

/*  explodeButton(){
      return (
        <button
           className="btn btn-primary float-left mt-4"
           type="button"
           onClick={this.handleExplode}
        >
          Explode Study
        </button>
      );
  };*/

  nextstep(){

      //TODO: switch sul tipo di studio => per cat & discreti/interval
      //numb_param = numero di parametri = numero di grafici da fare

      //dati_iper => dati test per categorical
      const dati_iper = [
          {iper_nome : 'hidden1',value:[1,2,3,4], attempt: [2,6,10,24]},
          {iper_nome: 'gamma', value:[0.2, 3, 0.02, 8], attempt: [1, 8, 5, 15]},
          {iper_nome: 'delta', value:[0.001, 0.02, 0.05, 0.006], attempt: [4, 4, 5, 23]},
          {iper_nome: 'omega', value:[0.001, 0.02, 0.05, 0.006, 0.43, 0.65], attempt: [4, 4, 5, 23, 6, 7]}];

      //dati_cont => dati test continue
      const dati_cont = [
          {iper_nome : 'cont 1',inter:[1,10], attempt: [1,1,1,2,2,2,10,10,10]},
          {iper_nome: 'cont 2', inter:[0.2,1], attempt: [0.2,0.2,1,1,1,0.2,1,1,0.5,0.5]},
          {iper_nome: 'cont 3', inter:[2,6], attempt: [2.5,5.59,5.87,4,4.32,3.46,3.98,5.557,6,4.99]},
          {iper_nome: 'cont 4', inter:[4,8], attempt: [4.99,6,6,6.65,4.5,7,7.98,8,6.88,5.99,4.76,7.99,6.98]}];

      switch(this.state.selectedOption){
          case "studio 1":
              return(
                  <ExplodeCategorical
                      label = {this.state.selectedOption}
                      numb_param = {4}
                      dati_iper_try = {dati_iper}
                  ></ExplodeCategorical>
              );
          case "studio 2":
               return(
                  <ExplodeCategorical
                      label = {this.state.selectedOption}
                      numb_param = {4}
                      dati_iper_try = {dati_iper}
                  ></ExplodeCategorical>
              );
           case "studio 3":
               return(
                  <ExplodeContinue
                      label = {this.state.selectedOption}
                      numb_param = {4}
                      dati_iper_try = {dati_cont}
                  ></ExplodeContinue>
              );



      }

  };

  nextstepHist(){
      alert("nextstep: " + this.state.selectedOption);

      switch(this.state.selectedOption){
          case "studio1":
              return(
                  <ExplodeCategorical
                  label = {this.state.selectedOption}></ExplodeCategorical>
              );
      }
  }


    handleChange (event){
        let {label} = event;
        this.setState({selectedOption: label});
        //alert("label: " + label);
    };

    handleExplode(){
        let label = this.state.selectedOption;
        alert("nome esploso dopo click:" + label);
        //TODO call api per tutte le info su quello studio, devo capire se discreto o continuo

        //seleziono lo studio e a seconda di cosa è faccio i due step
        //if cat o disc => torta, else => bind e hist graph



    };

  render() {
    return (
      <div className="content">
        <h3>Statistics of the terminated studies</h3>
        <Container>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Number of studies"
                statsValue = {Nstudy}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Number of trials"
                statsValue="1200"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Running studies"
                statsValue={Nrunning}
              />
            </Col>
          </Row>
          <Row>

          </Row>
        </Container>

          <div>
              <h2>Algorithms Usage</h2>
              <Polar data={data} />
          </div>

          <div>
              <h2>Metrics Usage</h2>
              <Polar data={data_metrics} />
          </div>

          <h2>Refresh studies and select one to see graph in detail</h2>
                <div>

                  <button
                     className="btn btn-success mt-1"
                     type="button"
                     onClick={() => (Open())}
                    >Refresh Studies
                    </button>
               </div>

                <div>
                       <Select
                              className="mt-4 col-offset-4"
                              onChange={this.handleChange}
                              options= {tech}/>
                </div>

                <div>
                    {/*this.explodeButton()*/}
                    {this.nextstep()}
                </div>
      </div>
    );
  }
}

export default Statistics;