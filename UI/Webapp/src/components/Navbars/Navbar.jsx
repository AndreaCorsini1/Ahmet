/**
 * Top navigation bar.
 * It is usefull for small screen and login/logout a user.
 */
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarExists: false,
    };

    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
  }

  mobileSidebarToggle() {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }

    document.documentElement.classList.toggle("nav-open");
    let node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }

  render() {
    let isLogin = sessionStorage.getItem('token') !== null;

    return (
      <Navbar variant="light" expand="lg">
        <Navbar.Brand>{this.props.brandText}</Navbar.Brand>
        <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={this.mobileSidebarToggle}/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          { isLogin ? (
            <NavLink to="/logout">
              Logout {sessionStorage.getItem('username')}
            </NavLink>) : (
            <NavLink to="/login">
              Login
            </NavLink>) }
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
