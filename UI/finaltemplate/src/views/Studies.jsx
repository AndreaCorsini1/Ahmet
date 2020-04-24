/**
 *
 */
import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import Card from "../components/Card/Card";
import Loading from "../components/Loading/Loading";
import getToken from "../components/Token/Token";
import {store} from "react-notifications-component";
import ErrorView from "../components/Errors/Error";

/**
 * TODO: work out better
 * Make a child for the study details
 *
 */
class Studies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uri: "http://localhost:8080/api/v0.1/studies/",
      options: null,
      error: null,
      isLoaded: false,
      renderDetails: false,
      studies: [],
      details: {}
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.fetchStudies = this.fetchStudies.bind(this);
  }

  handleDelete (event) {
    let {name} = event.target;
    let study = this.state.studies[name];

    store.addNotification({
      title: "Success",
      message: "Successfully deleted study " + study['name'],
      type: "info",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000
      }
    });

    // TODO: fetch for DELETE

    this.fetchStudies();
  }

  handleDetail (event) {
    let {name} = event.target;
    let study_obj = this.state.studies[name];
    let uri_trials = this.state.uri + study_obj['name'] + "/trials/";
    let uri_params = this.state.uri + study_obj['name'] + "/parameters/";

    fetch(uri_trials, this.state.options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299)
          return response.json();
        throw Error(response.statusText)
      })
      .then(
        (data) => {
          this.setState({
            details: data,
            renderDetails: true
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      );

    // TODO: add fetch on params and concat details (params and trials)
  }

  fetchStudies() {
    fetch(this.state.uri, this.state.options)
      .then(response => {
        if (response.status >= 200 && response.status <= 299)
          return response.json();
        throw Error(response.statusText)
      })
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            studies: data.results,
            renderDetails: false
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      );
  }

  renderDetails() {
    return (
      <Container>
        <Row>
          <Button
              onClick={this.fetchStudies}
              variant="primary"
          >
            Back
          </Button>
        </Row>
      </Container>);
  }

  renderStudies() {
    if (this.state.studies.length === 0)
      return <h2>No study to show</h2>;

    let colKeys = Object.keys(this.state.studies[0]);
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {colKeys.map((prop, key) => {
              return <th key={key}>{prop}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {this.state.studies.map((study, key) => {
            return (
              <tr key={key}>
                {colKeys.map((idx, s_key) => {
                  return <td key={s_key}>{study[idx]}</td>;
                })}
                <Col>
                  <Button
                      name={key}
                      variant="primary"
                      onClick={this.handleDetail}>
                      Detail
                  </Button>
                  <Button
                      name={key}
                      variant="primary"
                      onClick={this.handleDelete}>
                      Delete
                  </Button>
                </Col>
              </tr>
            );
          })}
        </tbody>
      </Table>
    )
  }

  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({
          options: {
            headers: {
              Authorization: 'Token ' + token,
              Accept: "application/json"
            },
            method: 'GET',
            cache: 'no-cache',
          }
        },
        this.fetchStudies);
      }
    });
  }

  render() {
    if (this.state.error) {
      console.error(this.state.error.message);
      return (<ErrorView message={this.state.error.message}/>);

    } else if (!this.state.isLoaded) {
      return <Loading text="Fetching data..."/>;

    } else {
      let content, title = "List of studies";
      if (!this.state.renderDetails) {
        content = this.renderStudies();
      } else {
        content = this.renderDetails();
        title = "Details of " + this.state.details['name']
      }
      return (
        <div className="content">
          <Container fluid>
            <Col className="text-center">
              <h2>Tabular data about studies</h2>
              <hr/>
            </Col>
            <Row>
              <Col md={12}>
                <Card
                    title={title}
                    //category="Here is a subtitle for this table"
                    ctTableResponsive
                    content={content}
                />
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default Studies;
