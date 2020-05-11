/**
 * Show api documentation for updating algorithms, metrics and dataset.
 *
 */
import React from "react";
import Loading from "../components/Loading/Loading";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import getToken from "../components/Token/Token";
import ErrorView from "../components/Errors/Error";

class APIDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiSpecs: null,
      url: "http://localhost:8080/api/v0.1/openapi",
      token: null,
      error: null,
    }

    this.fetchSpecs = this.fetchSpecs.bind(this);
  }

  componentDidMount() {
    getToken({
      setToken: (token) => {
        this.setState({
          token: token
        }, this.fetchSpecs);
      }
    })
  }

  fetchSpecs() {
    fetch(this.state.url, {
      headers: {
        Authorization: 'Token ' + this.state.token,
        Accept: 'application/json',
      },
      method: 'GET',
      cache: 'no-cache',
    }).then(response => response.json())
      .then(
        (data) => {
          this.setState({
            apiSpecs: data
          });
        },
        (error) => {
          this.setState({error: error})
        }
      );
  }

  render() {
    if (this.state.error)
      return <ErrorView message={this.state.error.message}/>
    else if (!this.state.apiSpecs)
      return <Loading />;
    else
      return (
        <div id="openapi" className="wrapper">
          <SwaggerUI
            spec={this.state.apiSpecs}
          />
        </div>
      );
  }
}

export default APIDoc;