/**
 * Login
 */
import React, {Component} from 'react';
//import react in our code.
import {StyleSheet, View, Text, TextInput} from 'react-native';

// import all basic components
import {Button} from 'react-native-elements';
import {getToken} from '../Components/Fetcher/Fetcher';
import FlashMessage from 'react-native-flash-message';
import {showMessage} from 'react-native-flash-message';

export default class Screen4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      error: null,
      username: '',
      password: '',
      logged: 'false',
    };
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    const {username, password} = this.state;
    getToken({
      setToken: (token) => {
        this.setState(
          {
            token: token,
            logged: 'true',
          },
          () => {
            showMessage({
              message: 'You Logged In!!',
              description: 'Enjoy Ahmet',
              type: 'success',
            });
          },
        );
      },
      onError: () => {
        showMessage({
          message: 'Wrong Login!!',
          description: 'sorry',
          type: 'danger',
        });
      },
      username: username,
      password: password,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.inputext}>Insert Credential</Text>
        <TextInput
          value={this.state.username}
          onChangeText={(username) => this.setState({username})}
          placeholder="Username"
          style={styles.input}
        />
        <TextInput
          value={this.state.password}
          onChangeText={(password) => this.setState({password})}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.input}
        />

        <Button title={'Login'} style={styles.input} onPress={this.onLogin} />
        <FlashMessage position="top" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inputext: {
    width: 200,
    height: 44,
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});
