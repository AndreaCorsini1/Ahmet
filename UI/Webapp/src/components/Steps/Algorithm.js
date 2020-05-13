/**
 *
 */
import React from "react";
import {
  Col,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row
} from "react-bootstrap";
import { APIGet } from "../Fetcher/Fetcher";
import Loading from "../Loading/Loading";
import CustomCard from "../Cards/CardBootstrap";
import ErrorView from "../Errors/Error";
import Select from 'react-select';

// Allowed number of runs and suggestions
const maxRuns = 50;
const runs = Array.from(Array(maxRuns).keys()).map((i) =>
              ({ name: 'runs', value: i+1, label: i+1})
             );
const maxSuggestions = 100;
const suggestions = Array.from(Array(maxSuggestions).keys()).map((i) =>
                      ({name: 'suggestions', value: i+1, label: i+1})
                    );

/**
 * Select the ALGORITHM and its settings.
 */
class Algorithm extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        error: null,
        isLoaded: false,
        algorithms: [],

        algorithm:    props.value ? props.value.name : null,
        algorithm_id: props.value ? props.value.id : null,
        supported_params: props.value ? props.value.supported_params : null,
        runs:         props.value ? props.value.runs : 10,
        suggestions:  props.value ? props.value.suggestions : 15
      };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetch tha algorithms from the API.
   * The API returns a list of algorithms data, having at least:
   *  - id
   *  - name
   *  - description
   *  - enabled
   */
  componentDidMount() {
    APIGet({
      onSuccess: (algorithms) => {
        this.setState({
          isLoaded: true,
          algorithms: algorithms
        });
      },
      onError: (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      },
      uri: this.props.uri,
      token: this.props.token
    });
  }

  /**
   * Merge algorithm data before call father handler.
   * The method calls the father only when all the object's fields (algorithm,
   * runs and suggestions) have been set.
   *
   * @param event
   */
  handleChange(event) {
    let update = {};
    let {name, value} = event.target ? event.target : event;

    if (name === 'runs') {
      update = {runs: value};
    } else if (name === 'suggestions') {
      update = {suggestions: value};
    } else {
      let algorithm = this.state.algorithms ? this.state.algorithms[parseInt(value)] : null;
      if (!algorithm) {
        this.setState({
          error: {message: "Internal error in algorithm selection"}
        });
      } else {
        update = {
          algorithm: algorithm.name,
          algorithm_id: algorithm.id,
          supported_params: algorithm.supported_params
        };
      }
    }

    this.setState(update, function() {
      if (this.state.algorithm && this.state.runs && this.state.suggestions) {
        this.props.handleChange({
          name: this.state.algorithm,
          id: this.state.algorithm_id,
          supported_params: this.state.supported_params,
          runs: this.state.runs,
          suggestions: this.state.suggestions
        });
      }
    });
  }

  /**
   * Layout renderer for the algorithms.
   */
  algorithms() {
    return (
      <CustomCard
        title="Select an algorithm:"
        subtitle="The Black-Box Optimization algorithm will be used to optimize
                  the metric chosen at the next step."
        content={
          <Container>
            {this.state.algorithms.map((alg, idx) => (
              <Row className="mt-2 justify-content-md-center">
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={
                    <Popover id={alg.id}>
                      <Popover.Title as="h3">{alg.name}</Popover.Title>
                      <Popover.Content>{alg.description}</Popover.Content>
                    </Popover>
                  }
                >
                  <Form.Check
                    type='checkbox'
                    name={alg.name} label={alg.name}
                    value={idx} onChange={this.handleChange}
                    checked={alg.id === this.state.algorithm_id}
                    disabled={!alg.enabled}
                  />
                </OverlayTrigger>
              </Row>
            ))}
          </Container>
        }
      />
    );
  }

  /**
   * Layout renderer of the algorithm's options.
   */
  algorithmSettings() {
    return (
      <CustomCard
        title="Algorithm settings:"
        content={
          <Container>
            <Row className="mt-2 justify-content-md-center">
              <Col className="title text-muted"> Number of algorithm runs: </Col>
              <Col>
                <Select
                  className="basic-select" classNamePrefix="select"
                  isSearchable name="runs" options={runs}
                  defaultValue={runs[this.state.runs-1]}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="mt-2 justify-content-md-center">
              <Col className="title text-muted">
                Number of trials generated at each run:
              </Col>
              <Col>
                <Select
                  className="basic-select" classNamePrefix="select"
                  isSearchable name="suggestions" options={suggestions}
                  defaultValue={suggestions[this.state.suggestions-1]}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
          </Container>
        }
      />);
  }

  render() {
    // Error view
    if (this.state.error) {
      return <ErrorView message={this.state.error.message} />;
    // Loading view
    } else if (!this.state.isLoaded) {
      return <Loading />;
    // Algorithms view
    } else {
      return ([
        this.algorithms(),
        this.algorithmSettings()
      ]);
    }
  }
}

export default Algorithm