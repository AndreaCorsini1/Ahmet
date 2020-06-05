/**
 *
 */
import React, { Component } from "react";
import { NavLink } from "react-router-dom";


function Logo(props) {
  let url = props.logoUrl ? props.logoUrl : "#";

  return (
    <div className="logo">
      <a href={url} className="simple-text logo-mini">
        <div className="logo-img">
          <img src={"/logo192.png"} alt="logo_image"/>
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

    this.updateDimensions = this.updateDimensions.bind(this)
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
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
            {this.props.routes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li className={this.activeRoute(prop.path)} key={key}>
                    <NavLink
                      to={prop.path}
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
