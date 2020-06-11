/**
 * Text card.
 */
import {Card} from 'react-native-shadow-cards';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function TextCard(props) {
  return (
    <Card style={{padding: 10, margin: 10}}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{props.title}</Text>
        <Text style={styles.sectionDescription}>{props.description}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
});

export default TextCard;
