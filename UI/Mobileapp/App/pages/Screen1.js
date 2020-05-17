/*Example of Navigation Drawer with Sectioned Menu*/
import React, {Component} from 'react';
//import react in our code.
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
//import {Header, Icon} from 'react-native-elements';
//import {Card} from 'react-native-elements';
import {Card} from 'react-native-shadow-cards';
// import all basic components

export default class Screen1 extends Component {
  //Screen1 Component
  render() {
    return (
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <ImageBackground
          source={require('App/image/background.jpeg')}
          style={styles.image}>
          <Card style={{padding: 10, margin: 10}}>
            <View style={styles.container}>
              <Image
                source={require('App/image/logo.png')}
                style={{
                  height: 135,
                  width: 155,
                }}
              />
              <Text style={styles.text}>Welcome to Ahmet App</Text>
            </View>
          </Card>

          <Card style={{padding: 10, margin: 10}}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>What is Ahmet?</Text>
              <Text style={styles.sectionDescription}>
                Framework for black-box optimization{'\n'}
              </Text>
            </View>
          </Card>

          <Card style={{padding: 10, margin: 10}}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Useful definitions</Text>
              <Text style={styles.sectionDescription}>
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
              <Text style={styles.sectionTitle} />
              <Text style={styles.sectionDescription} />
            </View>
          </Card>
        </ImageBackground>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
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
  text: {
    color: 'grey',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
