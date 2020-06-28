import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {VictoryLegend, VictoryPie} from 'victory-native';
import {Text} from 'react-native-elements';
import TextCard from "../Cards/TextCard";

// Could be useful
const {Width} = Dimensions.get('window');

function ChartPieMod(props) {
  let tot = 0;
  var data = [];
  var colors = [];
  let data_legend = [];

  for (let i = 0; i < props.occurrences.length; i += 1)
    tot += props.occurrences[i];

  if (tot === 0) {
    return (
      <View style={{flex: 1}}>
        <TextCard description="has not yet tried" title={props.title} />
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

    return (
      <View>
        <ScrollView horizontal={true} style={{alignContent: 'center'}}>
          <VictoryLegend
            height={150}
            width={1000}
            itemsPerRow={8}
            gutter={20}
            x={40}
            y={10}
            title={props.title}
            centerTitle
            orientation="horizontal"
            style={{border: {stroke: 'black'}, title: {fontSize: 15}}}
            colorScale={colors}
            data={data_legend}
          />
        </ScrollView>
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
}

export default ChartPieMod;
