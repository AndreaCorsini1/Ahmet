/**
 *
 */
import React, { Component } from "react";
import {Navbar, Nav, Form, FormControl, Button, NavDropdown} from "react-bootstrap";


class Header extends Component {

  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }

  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }

  render() {
    return (
      <Navbar variant="dark" expand="lg">
        <Navbar.Brand>{this.props.brandText}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={this.mobileSidebarToggle}/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form>
          <Nav.Link href="#link">Signin</Nav.Link>
          <Nav.Link href="#link">Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
