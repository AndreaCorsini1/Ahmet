/**
 * Manage the selection of discrete parameters (categorical and discrete).
 *
 */
import React from "react";
import { Form, Col } from "react-bootstrap";

class Discrete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Hack for transform event into object.
   *
   * @param event
   */
  handleChange(event) {
    let {name, value} = event.target;
    this.setState({value: value});

    this.props.handleChange({
      name: name,
      value: value
    });
  }

  render() {
    let options = this.props.values.map((value, idx) =>
      <option
        key={idx}
        value={value}
      >
        {value}
      </option>
    );
    return (
     <Form.Group>
       <h4> {this.props.name} </h4>
       <Form.Row>
         <Form.Label column sm={2}>
           Pick a value:
         </Form.Label>
         <Col>
           <Form.Control
               as="select"
               name={this.props.name}
               value={this.props.value}
               onChange={this.handleChange}
           >
             {options}
           </Form.Control>
         </Col>
       </Form.Row>
     </Form.Group>
    );
   }
}

export default Discrete;