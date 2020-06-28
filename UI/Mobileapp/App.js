/**
 * App
 */
import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Dimensions} from 'react-native';

//Import React Navigation
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';

//Import all the screens
import Screen1 from './Views/Screen1';
import Screen4 from './Views/Screen4';
import Screen2 from './Views/Screen2';
import Screen3 from './Views/Screen3';
import Screen5 from './Views/Screen5';

//Import custom Drawer / sidebar
import SideMenu from './Components/SideMenu/sidemenu';

console.disableYellowBox = true;

//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={require('./Images/drawer.png')}
            style={{width: 25, height: 25, marginLeft: 5}}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

//Stack Navigator for the First Option of Navigation Drawer
const FirstActivity_StackNavigator = createStackNavigator({
  //All the screen from the First Option will be indexed here
  First: {
    screen: Screen1,
    navigationOptions: ({navigation}) => ({
      title: 'Home',
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#0693E3',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Second Option of Navigation Drawer
const Screen2_StackNavigator = createStackNavigator({
  //All the screen from the Second Option will be indexed here
  Second: {
    screen: Screen2,
    navigationOptions: ({navigation}) => ({
      title: 'Studies',
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#0693E3',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const Screen3_StackNavigator = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Third: {
    screen: Screen3,
    navigationOptions: ({navigation}) => ({
      title: 'Statistics',
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#0693E3',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen4_StackNavigator = createStackNavigator({
  Fourth: {
    screen: Screen4,
    navigationOptions: ({navigation}) => ({
      title: 'Login',
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#0693E3',
      },
      headerTintColor: '#fff',
    }),
  },
});

const Screen5_StackNavigator = createStackNavigator({
  Fifth: {
    screen: Screen5,
    navigationOptions: ({navigation}) => ({
      title: 'Logout',
      headerLeft: () => (
        <NavigationDrawerStructure navigationProps={navigation} />
      ),
      headerStyle: {
        backgroundColor: '#0693E3',
      },
      headerTintColor: '#fff',
    }),
  },
});

//Drawer Navigator for the Navigation Drawer / Sidebar
const Drawer = createDrawerNavigator(
  {
    //Drawer Optons and indexing
    NavScreen1: {screen: FirstActivity_StackNavigator},
    NavScreen2: {screen: Screen2_StackNavigator},
    NavScreen3: {screen: Screen3_StackNavigator},
    NavScreen4: {screen: Screen4_StackNavigator},
    NavScreen5: {screen: Screen5_StackNavigator},
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width / 2,
  },
);

export default createAppContainer(Drawer);
