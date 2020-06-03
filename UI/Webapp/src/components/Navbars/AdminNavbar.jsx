/**
 *
 */
import React, { Component } from "react";
import {Navbar, Nav} from "react-bootstrap";


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarExists: false,
      signin: props.signin ? props.signin : false
    };

    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
  }

  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }

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
        <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={this.mobileSidebarToggle}/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          { this.state.signin ?
              <Nav.Link href="#link">Logout</Nav.Link> :
              <Nav.Link href="#link">Signin</Nav.Link> }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
