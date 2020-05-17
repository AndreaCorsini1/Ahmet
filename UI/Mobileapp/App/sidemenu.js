/*Example of Navigation Drawer with Sectioned Menu*/

import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
//import Drawer from 'react-native-circle-drawer';

class SideMenu extends Component {
  constructor() {
    super();
    /*Array of the sidebar navigation option with
    Heading, Subheading and screen to navigate.*/
    //Sreen to navigate can be any screen defined in Drawer Navigator in App.js
    this.options = [
      {
        mainHeading: 'Ahmet Menu',
        subOptions: [
          {secondaryHeading: 'Home', navigationPath: 'First'},
          {secondaryHeading: 'New Study', navigationPath: 'Second'},
          {secondaryHeading: 'Study', navigationPath: 'Third'},
          {secondaryHeading: 'Statistics', navigationPath: 'Four'},
        ],
      },
    ];
  }

  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            {this.options.map((option, key) => (
              <View>
                <Text style={styles.mainHeading}>{option.mainHeading}</Text>
                {option.subOptions.map((item, key) => (
                  <View style={styles.secondaryHeading} key={key}>
                    <Text onPress={this.navigateToScreen(item.navigationPath)}>
                      {item.secondaryHeading}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Text>Ahmet side menu</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  secondaryHeading: {
    padding: 30,
    fontSize: 40,
  },
  mainHeading: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    backgroundColor: '#B4DCF3',
    fontSize: 20,
    color: 'grey',
    fontWeight: 'bold',
  },
  footerContainer: {
    padding: 20,
    backgroundColor: '#B4DCF3',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

export default SideMenu;
