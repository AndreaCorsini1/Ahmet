/**
 * Notification: https://github.com/teodosii/react-notifications-component
 */
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ReactNotification from "react-notifications-component";

import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/pe-icon-7-stroke.css";
import "bootstrap/dist/css/bootstrap.min.css"
import "react-notifications-component/dist/theme.css"

import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";

import routes from "./routes";
import image from "assets/img/sidebar.jpg";


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image: image,
      color: "black",
    };

    this.mainPanel = React.createRef();
  }

  /**
   * Make the routes of the application.
   *
   * @param routes: array of routes, each one as a jsx object.
   */
  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (!prop.isProtected) {
        return (
          <Route
            path={prop.path}
            render={props => (<prop.component {...props} />)}
            key={key}
          />
        );
      } else {
        return (
          <Route
            path={prop.path}
            render={props => (
              sessionStorage.getItem('token') !== null ? (
                <prop.component {...props} />
              ) : (
                <Redirect push to="/login"/>
              )
            )}
            key={key}
          />
        );
      }
    });
  };

  getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (this.props.location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "No name";
  };

  componentDidUpdate(e) {
    if (window.innerWidth < 993 &&
          e.history.location.pathname !== e.location.pathname &&
            document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
    }

    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.mainPanel.current.scrollTop = 0;
    }
  }

  render() {
    return (
      <div className="wrapper">
        <ReactNotification />
        <Sidebar
          {...this.props}
          routes={routes}
          image={this.state.image}
          color={this.state.color}
        />
        <div id="main-panel" className="main-panel" ref={this.mainPanel}>
          <NavBar
            {...this.props}
            brandText={this.getBrandText(this.props.location.pathname)}
          />
          <Switch>{this.getRoutes(routes)}, <Redirect to="/home"/></Switch>
          <Footer />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" render={props => <App {...props} />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
