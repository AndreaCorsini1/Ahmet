/**
 * Top navigation bar.
 * It is useful for small screen and login/logout a user.
 */
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);

    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
  }

  mobileSidebarToggle() {
    let node = document.getElementById("bodyClick");
    if (node) {
      document.body.removeChild(node);
    } else {
      node = document.createElement("div");
      node.id = "bodyClick";
      node.onclick = this.mobileSidebarToggle;
      document.body.appendChild(node);
    }

    document.documentElement.classList.toggle("nav-open");
  }

  render() {
    let isLogin = sessionStorage.getItem('token') !== null;

    return (
      <Navbar variant="light" expand="lg">
        <Navbar.Brand>{this.props.brandText}</Navbar.Brand>
        <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={this.mobileSidebarToggle}
        />
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

export default NavBar;
