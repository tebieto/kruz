import React from 'react';
import { AppRegistry } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import BridgeScreen from './screens/Bridge';
import VerifyScreen from './screens/Verify';
import ChatScreen from './screens/Chat';

const MainNavigator = createStackNavigator(
  { 
  BridgeScreen: { screen: BridgeScreen }, 
  HomeScreen: { screen: HomeScreen },
  LoginScreen: { screen: LoginScreen },
  VerifyScreen: { screen: VerifyScreen },
  ChatScreen: { screen: ChatScreen },
  },
  {
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#2a5298',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
      },
      headerTintColor: 'white',
    },
  }
 );
 
 const MyRootComponent = createAppContainer(MainNavigator);

 const App = () => (
   <MyRootComponent />
 );
 
 export default App;