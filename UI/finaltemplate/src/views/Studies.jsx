/**
 *
 */
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

//import axios from 'axios'

export const onDelete = (ID, prop) => {
  //dentro prop ho la stringa completa dello studio
  //https://www.google.com/search?q=get+request+on+react#kpvalbx=_2mGEXsHACNKzkwWnnry4DQ21

  alert("hai premuto cancella: " + ID + " prop: " + prop);

/*  let post = [];
  let response = [];

  axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {alert(response.data)},
        post = response.data)
      .catch(error => (alert(error)))

  var json_obj = JSON.parse(response.data);
  alert(JSON.stringify(json_obj.title));*/
  //get sull'api

}

export const onDetail = (ID, prop) => {

  alert("hai premuto dettagli: " + ID + " prop: " + prop);
}



class Studies extends Component {
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="List of a completed studies"
                //category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                             <Button
                                bsStyle="success"
                                pullRight fill type="submit"
                                onClick={()=> onDetail(key, prop)}>
                                Detail
                            {/*<a href="https://www.youtube.com/" onClick={this}> Detail </a>*/}
                             </Button>
                            <Button
                                bsStyle="warning"
                                pullRight fill type="submit"
                                onClick={()=> onDelete(key, prop)}
                                onClick={() => this.props.handleClick("tr")}>
                                Delete
                            </Button>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Studies;
