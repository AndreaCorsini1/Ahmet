/*Example of Navigation Drawer with Sectioned Menu*/
import React, {Component} from 'react';
//import react in our code.
import {StyleSheet, View, Text, FlatList} from 'react-native';
// import all basic components
import {ListItem} from 'react-native-elements';
import {Icon} from 'react-native-vector-icons';

const list = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
  },
  // more items
];

export default class Screen2 extends Component {
  keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => (
    <ListItem
      title={item.name}
      subtitle={item.subtitle}
      leftAvatar={{source: {uri: item.avatar_url}}}
      bottomDivider
      chevron
      button
      onPress={() => {
        alert('test');
      }}
    />
  );

  //Screen2 Component
  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={list}
        renderItem={this.renderItem}
      />
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
});
