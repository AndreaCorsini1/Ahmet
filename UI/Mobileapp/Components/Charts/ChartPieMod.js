import React from 'react';
import {Dimensions, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {VictoryLegend, VictoryPie} from 'victory-native';
import {Text} from 'react-native-elements';

// Could be useful
const {Width} = Dimensions.get('window');

function ChartPieMod(props) {
  let tot = 0;
  var data = [];
  var colors = [];
  let data_legend = [];

  for (let idx in props) {
    tot += props[idx];
  }

  if (tot === 0) {
    return (
      <View>
        <Text>Parameter: {props.title} has not yet tried</Text>
      </View>
    );
  } else {
    for (let i = 0; i !== props.occurrences.length; i++) {
      colors.push(
        'rgb(' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ',' +
          Math.floor(Math.random() * 256) +
          ')',
      );
      data.push({
        x: props.occurrences[i].toString(),
        y: props.occurrences[i],
      });
      data_legend.push({
        name: props.labels[i].toString(),
      });
    }
  }
  return (
    <View style={{flex: 1}}>
      <Card style={{alignItems: 'center', flex: 1}}>
        <Text style={{textAlign: 'center'}}>
          Parameter Plotted: {props.title}
        </Text>
      </Card>
      <VictoryLegend
        height={100}
        itemsPerRow={7}
        x={10}
        y={10}
        padding={{top: 40}}
        title={props.title}
        centerTitle
        orientation="horizontal"
        gutter={20}
        style={{border: {stroke: 'black'}, title: {fontSize: 15}}}
        colorScale={colors}
        data={data_legend}
      />
      <VictoryPie
        padAngle={4}
        innerRadius={100}
        data={data}
        colorScale={colors}
        style={{
          labels: {
            fontSize: 15,
            fill: '#584b4a',
          },
        }}
      />
    </View>
  );
}

export default ChartPieMod;