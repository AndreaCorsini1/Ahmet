/**
 * Side menu for navigation.
 */
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, StyleSheet} from 'react-native';
import {token_real} from '../Fetcher/Fetcher';

/**
 * Array of the sidebar navigation option with Heading, Subheading and
 * screen to navigate.
 */
class SideMenu extends Component {
  constructor(props) {
    super(props);

    //Screen to navigate can be any screen defined in Drawer Navigator in App.js
    this.options = [
      {
        mainHeading: 'Ahmet Menu',
        subOptions: [
          {secondaryHeading: 'Home', navigationPath: 'First'},
          {secondaryHeading: 'Studies', navigationPath: 'Second'},
          {secondaryHeading: 'Statistics', navigationPath: 'Third'},
          {secondaryHeading: 'Login', navigationPath: 'Fourth'},
        ],
      },
    ];

    this.navigateToScreen = this.navigateToScreen.bind(this);
  }

  navigateToScreen(route) {
    let navigateAction;
    if (token_real !== null) {
      navigateAction = NavigationActions.navigate({
        routeName: route,
      });
    } else {
      navigateAction = NavigationActions.navigate({
        routeName: 'Fourth',
      });
    }

    this.props.navigation.dispatch(navigateAction);
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            {this.options.map((option) => (
              <View>
                <Text style={styles.mainHeading}>{option.mainHeading}</Text>
                {option.subOptions.map((item, key) => (
                  <View style={styles.secondaryHeading} key={key}>
                    <Text
                      onPress={() =>
                        this.navigateToScreen(item.navigationPath)
                      }>
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
