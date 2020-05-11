/**
 * Needs you Matte.
 */
import React, { Component } from "react";
import {Container, Row, Col} from "react-bootstrap";
import Select from 'react-select';
import StatsCard from "../components/Cards/StatsCard.jsx";
import Loading from "../components/Loading/Loading";
import CustomCard from "../components/Cards/CardBootstrap";
import {APIGet} from "../components/Fetcher/Fetcher";
import getToken from "../components/Token/Token";
import ColorfulPolar from "../components/Charts/ColorfulPolar.js";
import BinnedHistogram from "../components/Charts/BinnedHistogram.js";
import ErrorView from "../components/Errors/Error";


class Statistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      selectedStudy: 'General statistics',
      studies: null,
      trials: null,
      runningStudies: 1,
      token: null,
      algorithms: null,
      metrics: null,
      studyParameters: null,
      error: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.generalStats = this.generalStats.bind(this);
    this.studyStats = this.studyStats.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Fetch the token and then the algorithms and metric (static information
   * so far).
   * TODO: the token action will be removed with login
   */
  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({
          token: token
        }, this.generalStats);
        APIGet({
          onSuccess: (algorithms) => {
            this.setState({
              algorithms: algorithms.map((algorithm) => ({
                id: algorithm.id,
                name: algorithm.name
              })),
              isLoaded: this.state.metrics !== null &&
                        this.state.studies !== null &&
                        this.state.trials !== null
            });
          },
          onError: this.handleError,
          uri: "http://localhost:8080/api/v0.1/algorithms/",
          token: token
        });
        APIGet({
          onSuccess: (metrics) => {
            this.setState({
              metrics: metrics.map((metric) => ({
                id: metric.id,
                name: metric.name
              })),
              isLoaded: this.state.algorithms !== null &&
                        this.state.studies !== null &&
                        this.state.trials !== null
            });
          },
          onError: this.handleError,
          uri: "http://localhost:8080/api/v0.1/metrics/",
          token: token
        });
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
   *
   * @param event
   */
  handleChange(event) {
    let {value} = event;

    // General view
    if (value === 'General statistics') {
      this.setState({
        selectedStudy: 'General statistics',
        studies: null,
        trials: null,
        isLoaded: false
      }, this.generalStats);
    // Study view
    } else {
      this.setState({
        selectedStudy: value,
        isLoaded: false
      }, this.studyStats);
    }
  };

  generalStats() {
    APIGet({
      onSuccess: (studies) => {
        this.setState({
          isLoaded: this.state.metrics !== null &&
                    this.state.algorithms !== null &&
                    this.state.trials !== null,
          studies: studies,
        });
      },
      onError: this.handleError,
      uri: "http://localhost:8080/api/v0.1/studies/",
      token: this.state.token
    });
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          trials: trials,
          isLoaded: this.state.metrics !== null &&
                    this.state.algorithms !== null &&
                    this.state.studies !== null
        });
      },
      onError: this.handleError,
      uri: "http://localhost:8080/api/v0.1/trials/",
      token: this.state.token
    });
  }

  studyStats() {
    let uri = "http://localhost:8080/api/v0.1/studies/" + this.state.selectedStudy;
    APIGet({
      onSuccess: (parameters) => {
        this.setState({
          studyParameters: parameters,
          isLoaded: true
        })
      },
      onError: this.handleError,
      uri: uri + '/parameters/',
      token: this.state.token
    });
  }

  generalCharts() {
    let algOccurrences = Array(this.state.algorithms.length).fill(0);
    let metricOccurrences = Array(this.state.metrics.length).fill(0);

    for (let i = 0; i < this.state.studies.length; i++) {
      for (let a = 0; a < this.state.algorithms.length; a++) {
        if (this.state.studies[i].algorithm_id === this.state.algorithms[a].id)
          algOccurrences[a] += 1;
      }
      for (let m = 0; m < this.state.metrics.length; m++) {
        if (this.state.studies[i].metric_id === this.state.metrics[m].id)
          metricOccurrences[m] += 1;
      }
    }

    return ([
      <ColorfulPolar
        title="Algorithms usage"
        occurrences={algOccurrences}
        labels={this.state.algorithms.map((alg) => (alg.name))}
      />,
      <ColorfulPolar
        title="Metrics usage"
        occurrences={metricOccurrences}
        labels={this.state.metrics.map((metric) => (metric.name))}
      />
    ]);
  }

  studyCharts() {
    let trials = this.state.trials;

    return (
      this.state.studyParameters.map((param) => {
        if (param.type === 'INTEGER' || param.type === 'FLOAT') {
          let values = Array();
          for (let i = 0; i < trials.length; i += 1) {
            if (trials[i].study === this.state.selectedStudy)
              values.push(trials[i].parameters[param.name]);
          }
          return (
            <BinnedHistogram
              title={`${param.name}`}
              min={param.min} max={param.max}
              values={values}
            />
          );
        } else {
          let occurrences = Array(param.values.length).fill(0);
          for (let i = 0; i < trials.length; i += 1) {
            if (trials[i].study === this.state.selectedStudy) {
              for (let j = 0; j < occurrences.length; j += 1)
                if (trials[i].parameters[param.name] === param.values[j])
                  occurrences[j] += 1;
            }
          }
          return (
            <ColorfulPolar
              title={`${param.name}`}
              occurrences={occurrences}
              labels={param.values}
            />
          );
        }
      })
    );
  }

  renderCards() {
    return (
      <Container>
      <Row className="justify-content-center">
        <Col lg="w-20">
          <StatsCard
            border="warning"
            bigIcon={<i className="pe-7s-server text-warning" />}
            statsText="Total number of studies"
            statsValue = {this.state.studies.length}
          />
        </Col>
        <Col lg="w-20 px-3">
          <StatsCard
            border="success"
            bigIcon={<i className="pe-7s-wallet text-success" />}
            statsText="Total number of trials"
            statsValue={this.state.trials.length}
          />
        </Col>
        <Col lg="w-20">
          <StatsCard
            border="danger"
            bigIcon={<i className="pe-7s-graph1 text-danger" />}
            statsText="Number of running studies"
            statsValue={this.state.runningStudies}
          />
        </Col>
      </Row>
      </Container>
    );
  }

  renderSelect() {
    let studies = this.state.studies;

    if (!studies) {
      this.setState({
        error: {
          code: 500,
          message: "Internal error"
        }
      });
    } else {
      let options = (this.state.selectedStudy !== 'General statistics' ?
          [{value: 'General statistics', label: 'General statistics'}] : []);
      for (let idx = 0; idx < studies.length; idx++) {
        if (studies[idx].name !== this.state.selectedStudy)
          options.push({value: studies[idx].name, label: studies[idx].name})
      }
      return (
        <Container>
          <CustomCard
            title="Select a study for getting its charts"
            content={
              <Select
                onChange={this.handleChange}
                options={options}
                defaultValue={{
                  value: this.state.selectedStudy,
                  label: this.state.selectedStudy
                }}
              />
            }
          />
        </Container>
      );
    }
  }

  render() {
    if (!this.state.isLoaded)
      return <Loading text="Fetching data..."/>;

    else if (this.state.error)
      return (<ErrorView message={this.state.error.message} />);

    return (
      <div className="content">
        <Container fluid>
          <Col className="text-center">
            <h2>Analytics about studies</h2>
            <hr/>
          </Col>
          <Col className="justify-content-center">
            { this.renderSelect() }
            { this.renderCards()}
            { this.state.selectedStudy !== 'General statistics' ?
                this.studyCharts() : this.generalCharts() }
          </Col>
        </Container>
      </div>
    );
  }
}

export default Statistics;