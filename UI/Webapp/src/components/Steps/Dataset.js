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
 * Select the DATASET.
 */
class Dataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dataset: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    APIGet({
      onSuccess: (dataset) => {
        this.setState({
          isLoaded: true,
          dataset: dataset
        });
      },
      onError: (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      },
      uri: this.props.uri,
    });
  }

  handleChange(event) {
    let {name, value} = event.target;
    this.props.handleChange({
      id: parseInt(value),
      name: name
    })
  }

  render() {
    if (this.state.error) {
      return <ErrorView message={this.state.error.message} />;
    } else if (!this.state.isLoaded) {
      return (<Loading />);
    } else {
      return (
        <CustomCard
          title="Pick a dataset:"
          subtitle="The dataset is used in combination with the metric for
                    building the block-box space. If nothing can be selected
                    skip the step by clicking next."
          content={
            <Container>
              {this.state.dataset.map((dataset) => (
                <Row className="mt-2 justify-content-md-center">
                  <OverlayTrigger
                    placement="right" delay={{show: 150, hide: 300}}
                    overlay={
                      <Popover id={dataset.id}>
                        <Popover.Title as="h3">{dataset.name}</Popover.Title>
                        <Popover.Content>{dataset.description}</Popover.Content>
                      </Popover>
                    }
                  >
                    <Form.Check
                      type='checkbox'
                      name={dataset.name} label={dataset.name}
                      value={dataset.id} onChange={this.handleChange}
                      disabled={!this.props.types.includes(dataset.type)}
                      checked={this.props.value ? dataset.id === this.props.value.id : false}
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

export default Dataset;