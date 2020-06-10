import React from 'react';
import {ProgressChart} from 'react-native-chart-kit';
import {Dimensions, View} from 'react-native';
import Card from 'react-native-shadow-cards/lib/Card';

const {Width} = Dimensions.get('window');
const data = {
  labels: ['Swim', 'Bike', 'Run'], // optional
  data: [0.4, 0.6, 0.8],
};

export function PieChart(props) {
  let tot = 0;
  for (let idx in props.occurrences) {
    tot += props.occurrences[idx];
  }
  if (tot === 0) {
  } else {
    return (
      <View>
        <ProgressChart
          data={[{data: props.occurrences, label: props.labels}]}
          width={Width}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
        />
      </View>
    );
  }
}

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

//export default PieChart;
