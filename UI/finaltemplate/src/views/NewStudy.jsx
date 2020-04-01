/**
 *
 */
import React, {Component} from "react";
import { Card } from "components/Card/Card.jsx";
import { Grid, Row, Col } from "react-bootstrap";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasksmodel } from "components/Tasks/Tasksmodel.jsx";
import {TasksParameter} from "../components/Tasks/TasksParameter";


class NewStudy extends React.Component {

  render() {
    return (
      <div className="content">
        <h2>New Study</h2>
        <Grid fluid>
          <Row>
            <Col /*md={8}*/>
              <Card
                title="Choose one study from the list below"
                category="Only one study can be choose"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasksmodel />
                    </table>
                  </div>
                }
              />
            </Col>
            <Col /*md={4}*/>
               <Card
                title="Choice of parameter for the current model"
                category="Choose a parameter from the list below"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <TasksParameter />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }


}

export default NewStudy;
