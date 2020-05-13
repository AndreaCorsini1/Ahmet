import React from "react";
import {Bar} from 'react-chartjs-2';
import CustomCard from "../Cards/CardBootstrap";

// For the moment we keep a fixed number of bins
const numberBins = 10;
// Generator with seed
class ColorGenerator {
  constructor(seed) {
    this.seed = seed;
  }
  newColor() {
    let x = Math.sin(this.seed++) * 1000000000;
    return '#' + Math.floor(x).toString(16).substr(-6);
  }
}

/**
 * Make a binned histogram from continuous values.
 * The chart needs the min-max values delimiting the interval and the
 * list of values for making the binned histogram.
 */
function BinnedHistogram(props) {
  let content;
  let color = new ColorGenerator(props.seed);

  if (!props.values || props.values.length === 0) {
    content = <h5> Parameter: {props.title} has not yet tried </h5>;

  } else {
    let val = props.min;
    let base = Math.round((props.max - props.min) / numberBins * 1000) / 1000;

    let labels = Array(numberBins);
    let colors = Array(numberBins);
    for (let i = 0; i < labels.length; i += 1, val += base) {
      labels[i] = `${val.toFixed(2)}-${(val + base).toFixed(2)}`;
      colors[i] = color.newColor();
    }

    let occurrences = Array(numberBins).fill(0);
    for (let i = 0; i < props.values.length; i += 1)
      occurrences[parseInt((props.values[i] - props.min) / base)] += 1;

    content = <Bar data={{
      datasets: [{
        label: props.title,
        data: occurrences,
        backgroundColor: colors
      }],
      labels: labels
    }}/>
  }

  return (
    <CustomCard
      title={props.title}
      content={content}
    />
  );
}

export default BinnedHistogram;
