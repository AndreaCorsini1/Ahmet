/**
 * Home
 */
import React, {Component} from 'react';
import {StyleSheet, Text, ScrollView, ImageBackground} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import TextCard from '../Components/Cards/TextCard';
import ImageCard from '../Components/Cards/ImageCard';

/**
 * Perchè cazzo non si centrano le card nella scroll?
 */
class Screen1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        style={styles.scrollView}>
        <ImageBackground
          source={require('../Images/background.jpeg')}
          style={styles.image}>
          <ImageCard
            text="Welcome to Ahmet"
            image={require('../Images/logo.png')}
          />
          <TextCard
            title="What is Ahmet?"
            description="Framework for black-box optimization"
          />
          <TextCard
            title="Useful definitions"
            description={
              <Text>
                <Text style={styles.highlight}>Trial </Text>: a list of
                parameters value that will be evaluated against the metric.
                {'\n'}
                {'\n'}
                <Text style={styles.highlight}>Metric</Text>: a machine learning
                model representing the black box function.{'\n'}
                {'\n'}
                <Text style={styles.highlight}>Study</Text>: entity composed of
                a BBO algorithm, a metric and the trials.{'\n'}
                {'\n'}
                <Text style={styles.highlight}>Worker</Text>: a process or a
                thread responsible of evaluating a trial x.
                {'\n'}
                {'\n'}
                <Text style={styles.highlight}>Run</Text>: a complete
                optimization execution of the problem.
              </Text>
            }
          />
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
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
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default Screen1;
