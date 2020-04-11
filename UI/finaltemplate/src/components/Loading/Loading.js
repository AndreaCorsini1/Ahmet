/**
 *
 */
import React from "react";

function Loading() {
  return (
    <div className="text-center">
      <div className="spinner-border text-primary m-5" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <h3>Loading ...</h3>
    </div>
  );
}

export default Loading;