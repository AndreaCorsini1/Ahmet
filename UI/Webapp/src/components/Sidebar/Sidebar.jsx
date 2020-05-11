/**
 *
 */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import AdminNavbarLinks from "../Navbars/AdminNavbarLinks.jsx";
import logo from "assets/img/reactlogo.png";

function Logo(props) {
  let url = props.logoUrl ? props.logoUrl : "#";

  return (
    <div className="logo">
      <a href={url} className="simple-text logo-mini">
        <div className="logo-img">
          <img src={logo} alt="logo_image" />
        </div>
      </a>
      <a href={url} className="simple-text logo-normal">
        Ahmet
      </a>
    </div>
  );
}

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + this.props.image + ")"
    };

    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color={this.props.color}
        data-image={this.props.image}
      >
        <div className="sidebar-background" style={sidebarBackground} />
        <Logo />
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <AdminNavbarLinks /> : null}
            {this.props.routes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={this.activeRoute(prop.layout + prop.path)}
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;