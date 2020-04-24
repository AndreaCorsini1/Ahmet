/**
 * Manage the selection of continuous integer and float parameters.
 *
 */
import React from "react";
import {Form, Col} from "react-bootstrap";
import Card from "../Card/Card"

class Continuous extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: props.minValue,
      max: props.maxValue
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Intermediate handle for merging the min and max properties.
   *
   * @param event
   */
  handleChange(event) {
    let {name, value} = event.target;

    this.setState({
      [name]: value
    }, function () {
      let data = {
        minValue: this.state.min,
        maxValue: this.state.max
      };
      this.props.handleChange({
        name: this.props.name,
        value: data
      });
    });
  }

  render() {
    return (
      <Card
        title={this.props.name}
        content={
          <Col>
            <Form.Row>
              <Form.Label column sm={2}>
                Minimum value:
              </Form.Label>
              <Col>
                <Form.Control
                  type="numeric"
                  name="min"
                  value={this.state.minValue}
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Label column sm={2}>
                Maximum value:
              </Form.Label>
              <Col>
              <Form.Control
                type="numeric"
                name="max"
                value={this.state.maxValue}
                onChange={this.handleChange}
              />
              </Col>
            </Form.Row>
          </Col>
        }
      />
    );
  }
}

export default Continuous;