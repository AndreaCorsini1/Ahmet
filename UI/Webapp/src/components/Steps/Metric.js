/**
 *
 */
import React from "react";
import {Form, Container, Row, OverlayTrigger, Popover} from "react-bootstrap";
import Loading from "../Loading/Loading";
import CustomCard from "../Cards/CardBootstrap";
import ErrorView from "../Errors/Error";
import {APIGet} from "../Fetcher/Fetcher";

/**
 * Select the metric.
 */
class Metric extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      metrics: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    APIGet({
      onSuccess: (metrics) => {
        this.setState({
          isLoaded: true,
          metrics: metrics
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
   * Merge data on metric before call father handler.
   *
   * @param event
   */
  handleChange(event) {
    let {value} = event.target;
    let metric = this.state.metrics ? this.state.metrics[parseInt(value)] : null;
    if (!metric) {
      this.setState({
        error: {message: "Internal error in metric selection"}
      });
    } else {
      this.props.handleChange({
        id: metric.id,
        name: metric.name,
        dataset: metric.supported_dataset,
        space: metric.space
      });
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorView message={this.state.error.message}/>;
    } else if (!this.state.isLoaded) {
      return <Loading/>;
    } else {
      return (
        <CustomCard
          title="Choose a metric:"
          content={
            <Container>
              {this.state.metrics.map((metric, idx) => (
                <Row className="mt-2 justify-content-md-center">
                  <OverlayTrigger
                    placement="right" delay={{show: 150, hide: 300}}
                    overlay={
                      <Popover id={metric.id}>
                        <Popover.Title as="h3">{metric.name}</Popover.Title>
                        <Popover.Content>{metric.description}</Popover.Content>
                      </Popover>
                    }
                  >
                    <Form.Check
                      type='checkbox'
                      name={metric.name} label={metric.name}
                      value={idx} onChange={this.handleChange}
                      disabled={!metric.enabled}
                      checked={this.props.value ? metric.id === this.props.value.id : false}
                    />
                  </OverlayTrigger>
                </Row>
              ))}
            </Container>
          }
        />
      );
    }
  }
}

export default Metric;