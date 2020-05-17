/*Example of Navigation Drawer with Sectioned Menu*/
import React, {Component} from 'react';
//import react in our code.
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
// import all basic components
import {Card} from 'react-native-shadow-cards';
import {Button} from 'react-native-elements';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {data} from 'react-native-chart-kit/data';

const {width} = Dimensions.get('window');

const Data = [
  {
    id: 1,
    text: 'Running',
  },
];

const data_Hist = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const data_chart = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 100,
      ],
    },
  ],
};

const data_pie = [
  {
    name: 'Seoul',
    population: 21,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
  },
  {
    name: 'Toronto',
    population: 28,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
  },
  {
    name: 'Beijing',
    population: 53,
    color: 'red',
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
  },
  {
    name: 'New York',
    population: 85,
    color: '#194D33',
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
  },
  {
    name: 'Moscow',
    population: 11,
    color: 'rgb(0, 0, 255)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 10,
  },
];

export default class Screen4 extends Component {
  //Screen4 Component
  render() {
    return (
      <ScrollView style={styles.container}>
        <ScrollView
          ref={(scrollView) => {
            this.scrollView = scrollView;
          }}
          style={styles.container}
          //pagingEnabled={true}
          horizontal={true}
          decelerationRate={0}
          snapToInterval={width - 60}
          snapToAlignment={'center'}
          contentInset={{
            top: 0,
            left: 30,
            bottom: 0,
            right: 30,
          }}>
          <Card
            style={{padding: 10, margin: 10}}
            key={Data.id}
            title={Data.text}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <Image
                source={require('App/image/line-chart.jpg')}
                style={{
                  height: 135,
                  width: 155,
                }}
              />
              <Text style={{marginBottom: 10, fontSize: 30}}>Total trails </Text>
            </View>
          </Card>
          <Card
            style={{padding: 10, margin: 10, backgroundColor: '#ffffff'}}
            key={Data.id}
            title={Data.text}>
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <Image
                source={require('App/image/line-chart.jpg')}
                style={{
                  height: 135,
                  width: 155,
                }}
              />
              <Text style={{marginBottom: 10}}>Total number of studies </Text>
            </View>
          </Card>
        </ScrollView>
        <View>
          <Card style={{padding: 10, margin: 10}}>
            <Text>Bezier Line Chart</Text>
            <PieChart
              data={data_pie}
              width={Dimensions.get('window').width}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card>
        </View>
        <View>
          <Card style={{padding: 10, margin: 20, elevation: 15}}>
            <BarChart
              data={data_Hist}
              width={350}
              height={350}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: '#169fe2',
                backgroundGradientFrom: '#0b5dfb',
                backgroundGradientTo: '#3718ff',
                decimalPlaces: 1, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 20,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              verticalLabelRotation={90}
            />
          </Card>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    marginTop: 50,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  view: {
    marginTop: 100,
    backgroundColor: 'blue',
    width: width - 80,
    margin: 10,
    height: 200,
    borderRadius: 10,
    //paddingHorizontal : 30
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Set your own custom Color #0010ff, #b5ceee
  },
});

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

/* <Text style={{marginBottom: 10}}>Total number of studies </Text>
              <Button backgroundColor="#03A9F4" title="More details" />*/
