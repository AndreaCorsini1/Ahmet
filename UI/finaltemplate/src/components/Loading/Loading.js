/**
 *
 */
import React from "react";

function Loading(props) {
  let text = props.text || "Loading...";
  return (
    <div className="text-center">
      <div className="spinner-border text-primary m-5" role="status">
        <span className="sr-only">{ text }</span>
      </div>
      <h3>{ text }</h3>
    </div>
  );
}

export default Loading;