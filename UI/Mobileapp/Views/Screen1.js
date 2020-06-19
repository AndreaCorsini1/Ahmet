/**
 * Home
 */
import React, {Component} from 'react';
import {StyleSheet, Text, ScrollView} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import TextCard from '../Components/Cards/TextCard';
import ImageCard from '../Components/Cards/ImageCard';

class Screen1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{
          alignItems: 'center',
          backgroundColor: 'rgba(206,193,193,0.05)',
        }}>
        <ImageCard text="Ahmet" image={require('../Images/logo192.png')} />
        <TextCard
          title="What is Ahmet?"
          description="Framework for black-box optimization"
        />
        <TextCard
          title="Useful definitions"
          description={
            <Text>
              <Text style={styles.highlight}>Trial </Text>: a list of parameters
              value that will be evaluated against the metric.
              {'\n'}
              {'\n'}
              <Text style={styles.highlight}>Metric</Text>: a machine learning
              model representing the black box function.{'\n'}
              {'\n'}
              <Text style={styles.highlight}>Study</Text>: entity composed of a
              BBO algorithm, a metric and the trials.{'\n'}
              {'\n'}
              <Text style={styles.highlight}>Worker</Text>: a process or a
              thread responsible of evaluating a trial x.
              {'\n'}
              {'\n'}
              <Text style={styles.highlight}>Run</Text>: a complete optimization
              execution of the problem.
            </Text>
          }
        />
        <TextCard
          title="What Ahmet can do?"
          description={
            <Text>
              Whith this app you can constantly check all info about your
              studies, smartly and with a simple interface.
              {'\n'}
              {'\n'}
              You can menage the database of the studies, by start or delete old
              data
              {'\n'}
              {'\n'}
              With the statistics interface you can see all the parameters,
              algorithms, metrics in a simple graphs
            </Text>
          }
        />
        <TextCard title="Good Optimization!!" />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'transparent',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default Screen1;
