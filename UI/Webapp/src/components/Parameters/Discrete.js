/**
 * Manage the selection of discrete parameters (categorical and discrete).
 */
import React from "react";
import { Form, Col } from "react-bootstrap";
import CustomCard from "../Cards/CardBootstrap";
import Select from 'react-select';
import PropTypes from "prop-types";


class Discrete extends React.Component {
  constructor(props) {
    super(props);
    let options = props.options.map((val) => ({value: val, label: val}));

    let values;
    if (props.value) {
      values = props.value.values.map((val) => ({value: val, label: val}));
    } else {
      values = options;
      // Force default parameter value in father when props value is null
      props.handleChange({
        name: props.name,
        value: {
          values: values.map((val) => (val.value)),
          type: props.type
        }
      })
    }

    this.state = {
      value: values,
      options: options
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Hack for transform event into object.
   *
   */
  handleChange(values) {
    this.setState({value: values});
    this.props.handleChange({
      name: this.props.name,
      value: {
        values: values.map((val) => (val.value)),
        type: this.props.type
      }
    });
  }

  render() {
    return (
     <CustomCard
       title={this.props.name}
       content={
         <Form>
           <Form.Row>
             <Form.Label column sm={2}> Pick a value: </Form.Label>
             <Col>
               <Select
                isMulti name={this.props.name}
                options={this.state.options} defaultValue={this.state.value}
                className="basic-multi-select" classNamePrefix="select"
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

Discrete.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.array,
  handleChange: PropTypes.func.isRequired
}

export default Discrete;