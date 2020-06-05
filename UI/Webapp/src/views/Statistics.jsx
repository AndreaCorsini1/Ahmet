/**
 *
 */
import React, { Component } from "react";
import {Container, Row, Col} from "react-bootstrap";
import Select from 'react-select';
import StatsCard from "../components/Cards/StatsCard.jsx";
import Loading from "../components/Loading/Loading";
import CustomCard from "../components/Cards/CardBootstrap";
import {APIGet} from "../components/Fetcher/Fetcher";
import ColorfulPolar from "../components/Charts/ColorfulPolar.js";
import BinnedHistogram from "../components/Charts/BinnedHistogram.js";
import ErrorView from "../components/Errors/Error";

// Refresh time in ms
const refreshTime = 3000;
// Charts seed
const seed = 1234;

class Statistics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded: false,
      selectedStudy: 'General analytics',
      studies: null,
      trials: null,
      algorithms: null,
      metrics: null,
      studyParameters: null,
      studyTrials: null,
      error: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.generalStats = this.generalStats.bind(this);
    this.studyStats = this.studyStats.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Fetch the algorithms and metric (static information so far).
   */
  componentDidMount() {
    this.generalStats();
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
    });
  }

  componentWillUnmount() {
    if (this.timerID) {
      clearInterval(this.timerID);
    }
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
    if (value === 'General analytics') {
      this.setState({
        selectedStudy: 'General analytics',
        studies: null, trials: null,
        studyParameters: null, studyTrials: null,
        isLoaded: false
      }, () => {
        clearInterval(this.timerID);
        this.generalStats();
      });
    // Study view
    } else {
      this.setState({
        selectedStudy: value,
        isLoaded: false
      }, () => {

        if (this.timerID)
          clearInterval(this.timerID);

        APIGet({
          onSuccess: (parameters) => {
            this.setState({
              studyParameters: parameters,
              isLoaded: !!this.state.studyTrials
            });
          },
          onError: this.handleError,
          uri: 'http://localhost:8080/api/v0.1/studies/' +
                        this.state.selectedStudy + '/parameters/',
        });

        this.studyStats();
        this.timerID = setInterval(
          () => this.studyStats(),
          refreshTime
        );
      });
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
    });
  }

  studyStats() {
    let url = 'http://localhost:8080/api/v0.1/studies/' + this.state.selectedStudy;
    APIGet({
      onSuccess: (trials) => {
        this.setState({
          studyTrials: trials,
          isLoaded: !!this.state.studyParameters
        });
      },
      onError: this.handleError,
      uri: url + '/trials/',
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
        occurrences={algOccurrences} seed={28765}
        labels={this.state.algorithms.map((alg) => (alg.name))}
      />,
      <ColorfulPolar
        title="Metrics usage"
        occurrences={metricOccurrences} seed={36547}
        labels={this.state.metrics.map((metric) => (metric.name))}
      />
    ]);
  }

  studyCharts() {
    let trials = this.state.studyTrials;

    return (
      this.state.studyParameters.map((param, idx) => {
        if (param.type === 'INTEGER' || param.type === 'FLOAT') {
          let values = Array();
          for (let i = 0; i < trials.length; i += 1) {
            values.push(trials[i].parameters[param.name]);
          }
          return (
            <BinnedHistogram
              title={`${param.name}`} min={param.min} max={param.max}
              values={values} seed={seed * (idx + 1)}
            />
          );
        } else {
          let occurrences = Array(param.values.length).fill(0);
          for (let i = 0; i < trials.length; i += 1) {
            for (let j = 0; j < occurrences.length; j += 1) {
              if (trials[i].parameters[param.name] === param.values[j])
                occurrences[j] += 1;
            }
          }
          return (
            <ColorfulPolar
              title={`${param.name}`} occurrences={occurrences}
              labels={param.values} seed={seed * (idx + 1)}
            />
          );
        }
      })
    );
  }

  renderGeneralCards() {
    let numPending = 0;
    this.state.studies.map((study) => {
      if (study.status === 'PENDING') {
        numPending += 1;
      }
    });
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
            statsText="Number of pending studies"
            statsValue={numPending}
          />
        </Col>
      </Row>
      </Container>
    );
  }

  renderStudyCards() {
    let numStopped = 0;
    this.state.studyTrials.map((trial) => {
      numStopped += trial.status === 'STOPPED' ? 1 : 0;
    });
    return (
      <Container>
      <Row className="justify-content-center">
        <Col lg="w-20">
          <StatsCard
            border="success"
            bigIcon={<i className="pe-7s-server text-success" />}
            statsText="Number of trials in the study"
            statsValue = {this.state.studyTrials.length}
          />
        </Col>
        <Col lg="w-20 px-3">
          <StatsCard
            border="danger"
            bigIcon={<i className="pe-7s-gleam text-danger" />}
            statsText="Number of stopped trials"
            statsValue={numStopped}
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
      let options = (this.state.selectedStudy !== 'General analytics' ?
          [{value: 'General analytics', label: 'General analytics'}] : []);
      for (let idx = 0; idx < studies.length; idx++) {
        if (studies[idx].name !== this.state.selectedStudy)
          options.push({value: studies[idx].name, label: studies[idx].name})
      }
      return (
        <Container>
          <CustomCard
            title="Select a study for its analytics"
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
            <h2 className="font-weight-light">Analytics</h2>
            <hr/>
          </Col>
          <Col className="justify-content-center">
            { this.renderSelect() }
            { this.state.selectedStudy !== 'General analytics' ?
                this.renderStudyCards() : this.renderGeneralCards() }
            { this.state.selectedStudy !== 'General analytics' ?
                this.studyCharts() : this.generalCharts() }
          </Col>
        </Container>
      </div>
    );
  }
}

export default Statistics;