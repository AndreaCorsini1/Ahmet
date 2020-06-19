/**
 * Fixed binned histogram.
 * 10 bins for every histogram.
 */
import React from 'react';
import {Card} from 'react-native-shadow-cards';
import {View} from 'react-native';
import {VictoryBar, VictoryChart} from 'victory-native';
import {Text} from 'react-native-elements';
import TextCard from '../Cards/TextCard';

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
      <View style={{flex: 1}}>
        <TextCard description="has not yet tried" title={props.title} />
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
        <Card style={{alignItems: 'center', flex: 1, marginLeft: 20}}>
          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}>
            {' '}
            Parameter Plotted: {props.title}{' '}
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
