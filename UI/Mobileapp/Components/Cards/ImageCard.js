/**
 * Image card
 */
import {Card} from 'react-native-shadow-cards';
import {StyleSheet, Image, Text, View} from 'react-native';
import React from 'react';

function ImageCard(props) {
  return (
    <Card style={{padding: 10, margin: 10}}>
      <View style={styles.container}>
        <Image source={props.image} style={{height: 135, width: 155}} />
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default ImageCard;
