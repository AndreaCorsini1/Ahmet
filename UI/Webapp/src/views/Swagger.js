/**
 * Show api documentation for updating algorithms, metrics and dataset.
 */
import React from "react";
import Loading from "../components/Loading/Loading";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import ErrorView from "../components/Errors/Error";
import { APIGet } from "../components/Fetcher/Fetcher";

class APIDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiSpecs: null,
      error: null,
    }
  }

  componentDidMount() {
    APIGet({
      onSuccess: (data) => {
          this.setState({
            apiSpecs: data
          });
        },
      onError: (error) => ( this.setState({error: error})),
      uri: "/openapi"
    });
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