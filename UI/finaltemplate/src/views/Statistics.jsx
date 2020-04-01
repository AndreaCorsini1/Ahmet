/**
 *
 */
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasksmodel } from "components/Tasks/Tasksmodel.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
  Nstudy,
  Nrunning,
} from "variables/Variables.jsx";
import {onSubmit} from "../components/Checkboxparameter/Checkboxparameter";

export const Open = () => {

    //codice per andare a fare un get su ameth e mettere il valore dentro il file vars
    alert("Soreta");

    //dopo cambio il valore della varibile in vars e dopo nel render questa verrà visualizzata

}


class Statistics extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }


  render() {
    return (
      <div className="content">
        <h3>Statistics of the terminated studies</h3>
        <h4>Update your studies to see updated graphs</h4>
              <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>

              </div>

                <Row>
                  <Col sm={{offset: 13, size : 'auto' }}>
                       <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center"
                            }}>
                                <button onClick={() => (Open())}>Update Studies</button>
                       </div>
                    </Col>
                </Row>

        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Number of studies"
                statsValue = {Nstudy}
                //statsIcon={<i className="fa fa-refresh" />}
                //statsIconText="Number of completed studies"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Number of trials"
                statsValue="1200"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Number of evaluated trials"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Running studies"
                statsValue={Nrunning}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="Running studies"
              />
            </Col>
          </Row>
          <Row>
              <Card
                //statsIcon="fa fa-history"
                id="chartHours"
                title="Graph of parameter related to study"
                //category="24 Hours performance"
                //stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                        //grafico centrale
                      data={dataSales}
                      type="Line"
                      //options={optionsSales}
                      //responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
             <Card
                //statsIcon="fa fa-clock-o"
                title="Ripartition of studies by model used"
                //category="Last Campaign Performance"
                //stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendPie)}</div>
                }
              />
            <Col>
              <Card
                id="chartActivity"
                title="Comparison of the last 12 studies"
                //category="All products including Taxes"
                //stats="Data information certified"
                //statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
               legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
}

export default Statistics;
