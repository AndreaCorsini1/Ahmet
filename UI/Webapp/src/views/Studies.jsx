/**
 *
 */
import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import CustomCard from "../components/Cards/CardBootstrap";
import Loading from "../components/Loading/Loading";
import getToken from "../components/Token/Token";
import {store} from "react-notifications-component";
import ErrorView from "../components/Errors/Error";
import {APIGet, APIDelete} from "../components/Fetcher/Fetcher";

// Base url for the view
const baseUrl = "http://localhost:8080/api/v0.1/studies/";
const details = ['id', 'parameters', ]

/**
 * Make a table containing the provide data.
 *
 * @param props
 * @returns {*}
 */
function Tabular(props) {
  let content;

  // Missing data or no data to show
  if (!props.data || props.data.length === 0) {
    content = <h5>Nothing to show</h5>;
  // Tabular view of the data
  } else {
    let headers = Object.keys(props.data[0]);
    content = (
      <Table
        striped bordered hover responsive
        onClick={props.onRowClick ? props.onRowClick : null}
      >
        <thead>
          <tr>{
            headers.map((header, key) => (
              <th key={key}>{header}</th>
            ))
          }</tr>
        </thead>
        <tbody>{
          props.data.map((item, key) => (
          <tr key={key} id={item.id || 0}>{
            headers.map((idx, s_key) => (
              <td key={s_key} data-father={key}>
                {String(item[idx])}
              </td>
            ))
          }</tr>
          ))
        }</tbody>
      </Table>
    );
  }
  return <CustomCard title={props.title} content={content}/>;
}

/**
 *
 */
class Studies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      renderDetails: false,
      token: null,
      studies: [],
      study_idx: null,
      trials: null,
      params: null
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleStudies = this.handleStudies.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  /**
   * Fetch the token and then the studies.
   * TODO: the token action will be removed with login
   */
  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({
          token: token
        }, this.handleStudies);
      }
    });
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
   * Fetch the studies and enable the studies view.
   */
  handleStudies() {
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded: true,
          studies: studies,
          renderDetails: false,
          trials: null,
          params: null
        });
      },
      onError: this.handleError,
      uri: baseUrl,
      token: this.state.token
    })
  }

  /**
   * Delete a study and force the going back to studies view.
   */
  handleDelete() {
    let studyName = this.state.studies[this.state.study_idx].name;
    APIDelete({
      onSuccess: (msg) => {
        store.addNotification({
          title: msg,
          message: `Successfully deleted study : ${studyName}`, type: "info",
          insert: "top", container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 }
        });
        this.handleStudies();
      },
      onError: this.handleError,
      uri: baseUrl + studyName + '/',
      token: this.state.token
    });
  }

  /**
   * Handle the click of a cell within a row.
   * The click will open the details of the study (i.e. the row).
   *
   * @param event
   */
  handleRowClick(event) {
    let idx = event.target.getAttribute('data-father');
    let studyName = this.state.studies[idx].name;
    let uri = baseUrl + studyName;

    this.setState({
      renderDetails: true,
      isLoaded: false,
      study_idx: idx
    }, function() {
      APIGet({
        onSuccess: (trials) => this.setState({
          trials: trials,
          isLoaded: this.state.params ? true : false
        }),
        onError: this.handleError,
        uri: uri + /trials/,
        token: this.state.token
      });
      APIGet({
        onSuccess: (params) => this.setState({
          params: params,
          isLoaded: this.state.trials ? true : false
        }),
        onError: this.handleError,
        uri: uri + /parameters/,
        token: this.state.token
      });
    });
  }

  handleStart() {
    let studyName = this.state.studies[this.state.study_idx].name;
    let uri = baseUrl + studyName + '/start/'
    APIGet({
      onSuccess: () => {
        store.addNotification({
          title: "Success",
          message: `The study : ${studyName} has been started`, type: "success",
          insert: "top", container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 }
        });
        this.handleStudies();
      },
      onError: this.handleError,
      uri: uri,
      token: this.state.token
    })
  }

  renderDetails() {
    let name = this.state.studies[this.state.study_idx].name;
    return (
      <Container>
        <Col>
          {<Tabular
            data={this.state.params}
            title={`Parameters of study: ${name}`}
          />}
          {<Tabular
            data={this.state.trials.map((trial) => ({
              id: trial.id,
              score: trial.score,
              score_info: trial.score_info,
              status: trial.status,
              ...trial.parameters
            }))}
            title={`Trials of study: ${name}`}
          />}
        </Col>
        <Row className="text-center">
          <Col>
            <Button variant="primary"
              onClick={this.handleStudies}
            > Back </Button>
          </Col>
          <Col>
            <Button variant="success"
              onClick={this.handleStart}
            > Start </Button>
          </Col>
          <Col>
            <Button variant="danger"
              onClick={this.handleDelete}
            > Delete </Button>
          </Col>
        </Row>
      </Container>);
  }

  render() {
    if (this.state.error) {
      return <ErrorView message={this.state.error.message}/>;

    } else if (!this.state.isLoaded) {
      return <Loading text="Fetching data..."/>;

    } else {
      return (
        <div className="content">
          <Container fluid>
            <Col className="text-center">
              <h2>Tabular data</h2>
              <hr/>
            </Col>
            <Row>
              <Col md={12}>{
                this.state.renderDetails ?
                  this.renderDetails() :
                  <Tabular
                    title="List of studies"
                    onRowClick={this.handleRowClick}
                    data={this.state.studies}
                  />
              }</Col>
            </Row>
          </Container>
        </div>
      );
    }
  }
}

export default Studies;
