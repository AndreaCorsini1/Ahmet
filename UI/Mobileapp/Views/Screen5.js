/**
 * Logout
 */
import React, {Component} from 'react';
//import react in our code.
import {StyleSheet, View, Button} from 'react-native';

// import all basic components
import TextCard from '../Components/Cards/TextCard';
import {deleteToken} from '../Components/Fetcher/Fetcher';

export default class Screen5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      logged: 'true',
    };
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout() {
    deleteToken();
    this.props.navigation.navigate('First');
  }

  render() {
    return (
      <View style={styles.container}>
        <TextCard title="You are currently loggedin" />
        <Button
          title={'Logout'}
          style={styles.input}
          onPress={this.onLogout}
          color={'rgba(217,8,8,0.68)'}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    width: 200,
    height: 44,
    marginTop: 20,
    marginBottom: 100,
  },
});
