import React from "react";
import {Polar} from "react-chartjs-2";
import CustomCard from "../Cards/CardBootstrap";

//random color for graph
function generateColor () {
    return '#' + Math.random().toString(16).substr(-6);
}

function ColorfulPolar(props) {
  let content;
  let tot = 0;
  for (let idx in props.occurrences)
    tot += props.occurrences[idx];

  if (tot === 0) {
    content = <h5> Parameter: {props.title} has not yet tried </h5>;
  } else {
    content = <Polar data={{
      datasets: [{
        data: props.occurrences,
        backgroundColor: props.labels.map(() => (generateColor()))
      }],
      labels: props.labels
    }}/>
  }

  return (
    <CustomCard
      title={props.title}
      content={content}
    />
  );
}

export default ColorfulPolar;