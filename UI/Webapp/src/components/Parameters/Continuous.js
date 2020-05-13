/**
 * Manage the selection of continuous integer and float parameters.
 */
import React from "react";
import {Form, Col} from "react-bootstrap";
import CustomCard from "../Cards/CardBootstrap";
import PropTypes from "prop-types";
import {store} from "react-notifications-component";


class Continuous extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: props.value ? props.value.min : null,
      max: props.value ? props.value.max : null
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

    // handle null value
    if (!value) {
      this.setState({[name]: null});

    // handle not a number (react numeric input issue)
    } else if (isNaN(parseFloat(value))) {
      this.setState({[name]: null});
      store.addNotification({
        title: "Wrong parameter", type: "danger",
        message: `Parameter: ${this.props.name} accepts only numeric value`,
        insert: "top", container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 2000 }
      });

    // handle numeric change
    } else {
      value = value.replace(',', '.');
      this.setState({
        [name]: value
      }, function () {
        if (this.state.min && this.state.max &&
            this.state.min < this.state.max &&
            value[value.length - 1] !== '.') {
          this.props.handleChange({
            name: this.props.name,
            value: {
              min: this.props.type === 'INTEGER' ?
                    parseInt(this.state.min) : parseFloat(this.state.min),
              max: this.props.type === 'INTEGER' ?
                    parseInt(this.state.max) : parseFloat(this.state.max),
              type: this.props.type
            }
          });
        }
      });
    }
  }

  render() {
    console.log(this.state);
    return (
      <CustomCard
        title={this.props.name}
        content={
          <Form>
            <Form.Row>
              <Form.Label column sm={2}> Minimum value: </Form.Label>
              <Col>
                <Form.Control
                  type="numeric" name="min"
                  value={this.state.min} placeholder="Type a number..."
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Label column sm={2}> Maximum value: </Form.Label>
              <Col>
                <Form.Control
                  className="mt-1" type="numeric" name="max"
                  value={this.state.max} placeholder="Type a number..."
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Row>
          </Form>
        }
      />
    );
  }
}

Continuous.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  handleChange: PropTypes.func.isRequired
}

export default Continuous;