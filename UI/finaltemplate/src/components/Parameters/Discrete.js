/**
 * Manage the selection of discrete parameters (categorical and discrete).
 *
 */
import React from "react";
import { Form, Col } from "react-bootstrap";
import Card from "../Card/Card"
import Select from 'react-select';

class Discrete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Hack for transform event into object.
   *
   */
  handleChange(event) {
    this.setState({value: event});

    let values = event.map((val) => {return val.value;});
    this.props.handleChange({
      name: this.props.name,
      value: values
    });
  }

  render() {
    let options = this.props.values.map((val) => {
      return {
        value: val,
        label: val}
      }
    );
    return (
     <Card
       title={this.props.name}
       content={
         <Form.Row>
           <Form.Label column sm={2}>
             Pick a value:
           </Form.Label>
           <Col>
            <Select
              isMulti
              name={this.props.name}
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={this.handleChange}
            />
           </Col>
         </Form.Row>
       }
     />
    );
   }
}

export default Discrete;