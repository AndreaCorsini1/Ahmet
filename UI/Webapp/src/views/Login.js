/**
 * Simple login view without registration.
 */
import React from "react";
import { Container, Col, Row, Button, Form } from "react-bootstrap";
import { APIPost } from "../components/Fetcher/Fetcher";
import { store } from "react-notifications-component";


class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSession = this.handleSession.bind(this);
  }

  /**
   * Create the session for the user.
   *
   * @param data: data to store in the session (only token for the moment).
   */
  handleSession(data) {
    sessionStorage.setItem('token', data['token']);
    sessionStorage.setItem('username', this.state.username);

    store.addNotification({
      title: "Successfully login",
      message: "Now all the Ahmet functionalities are available!",
      type: "success", insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 3000 }
    });

    this.props.history.goBack();
  }

  /**
   * Verify the provided credential.
   */
  handleSubmit() {
    APIPost({
      onSuccess: this.handleSession,
      onError: (error) => {
        console.log(error);
        store.addNotification({
          title: "Wrong login",
          message: "Fix the username and password before retrying!",
          type: "danger", insert: "top",
          container: "top-right",
          animationIn: ["animated", "fadeIn"],
          animationOut: ["animated", "fadeOut"],
          dismiss: { duration: 2000 }
        });
      },
      uri: "/token-auth/",
      token: '',
      data: {
        username: this.state.username,
        password: this.state.password
      }
    });
  }

  handleUserChange(e) {
    this.setState({
      username: e.target.value,
    });
  };

  handlePassChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  render() {
    return (
      <div className="content">
        <Container fluid className="text-center">
          <Col>
            <h2 className="font-weight-light">Login to Ahmet</h2>
            <hr/>
          </Col>
          <Form>
            <Form.Group as={Row} controlId="Username"
              className="justify-content-center">
              <Form.Label column sm="2">
                Username
              </Form.Label>
              <Col sm="10" lg="6">
                <Form.Control
                    autoFocus
                    type="text"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.handleUserChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="Password"
              className="justify-content-center">
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10" lg="6">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handlePassChange}
                />
              </Col>
            </Form.Group>
            <Button
              disabled={this.state.username.length === 0 &&
                          this.state.password.length === 0}
              onClick={this.handleSubmit}>
              Login
            </Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Login;
