import React, { Component } from 'react';
import {NavigationActions, StackActions} from 'react-navigation';
import {
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import {Text} from 'native-base'

const navigate = ({ navigation }) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({loggedIn: true});
    }, 1000);
  });

class Bridge extends Component { 
static navigationOptions = {
    title: '',
    headerLeft: () => (
    <Text></Text>
    ),
    headerTitle: () => (
        <Text style={styling.homeLogoText}>KROOOZ</Text>
        )
    };
    
    state = {
        isbn: '',
    }

     componentDidMount() {
        const {navigation} = this.props
        navigate({navigation})
        .then(()=> {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'LoginScreen'})],
                key: null,
              });
              this.props.navigation.dispatch(resetAction);
        })
    }

    render() {
    return(
    <SafeAreaView style={styleBridge.container}>
         <ActivityIndicator color="#2a5298" />
    </SafeAreaView>
    );
  }
}

styleBridge = StyleSheet.create({
    container: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: "center",
      paddingBottom: 200
    },
    homeLogoText: {
        fontFamily: 'cursive',
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 10,
        color:'#fff'
    }
});

export default Bridge