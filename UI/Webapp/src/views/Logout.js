/**
 * Simple logout view for removing username and token from session.
 */
import React from "react";
import { Container } from "react-bootstrap";
import { store } from "react-notifications-component";
import { NavLink } from "react-router-dom";


class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // If nothing to remove redirect home
    if (sessionStorage.getItem('token') === null) {
      store.addNotification({
        title: "Error",
        message: "You are trying to logout without being logged in!",
        type: "danger", insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: { duration: 3000 }
      });
      this.props.history.push("/home");
    }

    let user = sessionStorage.getItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    return (
      <div className="content text-center">
        <Container>
          <h2 className="font-weight-light">
            Successfully logged out user: {user}
          </h2>
          <NavLink to="/home">Go home</NavLink>
        </Container>
      </div>
    );
  }
}

export default Login;