import React from 'react';
import {Card} from 'react-native-shadow-cards';
import {BarChart} from 'react-native-chart-kit';
import {View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryHistogram,
  VictoryLabel,
  VictoryLegend,
  VictoryPie,
  VictoryPolarAxis,
} from 'victory-native';
import {Text} from 'react-native-elements';

// For the moment we keep a fixed number of bins
const numberBins = 10;

/**
 * Make a binned histogram from continuous values.
 * The chart needs the min-max values delimiting the interval and the
 * list of values for making the binned histogram.
 */
function BinnedHistogram(props) {
  if (!props.values || props.values.length === 0) {
    return (
      <View>
        <Text>Parameter: {props.title} has not yet tried</Text>
      </View>
    );
  } else {
    let val = props.min;
    let base = Math.round(((props.max - props.min) / numberBins) * 1000) / 1000;

    let labels = Array(numberBins);
    for (let i = 0; i < labels.length; i += 1, val += base) {
      labels[i] = `${val.toFixed(2)}-${(val + base).toFixed(2)}`;
    }

    let occurrences = Array(numberBins).fill(0);
    for (let i = 0; i < props.values.length; i += 1) {
      occurrences[parseInt((props.values[i] - props.min) / base)] += 1;
    }

    var data = [];
    for (let i = 0; i !== numberBins; i++) {
      data.push({bins: parseFloat(labels[i]), attempt: occurrences[i]});
    }

    return (
      <View>
        <Card style={{alignItems: 'center', flex: 1}}>
          <Text style={{textAlign: 'center'}}>
            Parameter Plotted: {props.title}
          </Text>
        </Card>
        <VictoryChart>
          <VictoryBar
            alignment="start"
            barRatio={0.5}
            style={{
              data: {fill: 'rgba(52,132,229,0.61)'},
            }}
            data={data}
            x="bins"
            y="attempt"
          />
        </VictoryChart>
      </View>
    );
  }
}

export default BinnedHistogram;
