import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, Button, ScrollableTab } from 'native-base';
import Tab1 from '../tabs/Main';
import Tab2 from '../tabs/Share';
import {
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    StyleSheet
  } from 'react-native';

class Home extends Component {

    static navigationOptions = {
        title: '',
        headerLeft: () => (
        <Text></Text>
        ),
        headerTitle: () => (
            <Text style={styling.homeLogoText}>KROOOZ</Text>
            )
        };
        render() {
            return (
              <Container>
                <Tabs transparent renderTabBar={()=> <ScrollableTab style={styling.tab} />}>
                  <Tab heading={ <TabHeading style={styling.tab}><Icon name="md-chatbubbles" /><Text>Messages</Text></TabHeading>}>
                    <Tab1 />
                  </Tab>
                  <Tab heading={ <TabHeading style={styling.tab}><Icon name="share" /><Text>Connect</Text></TabHeading>}>
                    <Tab2 />
                  </Tab>
                </Tabs>
              </Container>
            );
          }
}

styling = StyleSheet.create({
    tab: {
        backgroundColor: '#2a5298',
      },
    homeLogoBtn: {
        backgroundColor: 'transparent',
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
    },
    homeLogoText: {
        fontFamily: 'cursive',
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 50,
        color:'#fff',
        alignSelf: 'center'
    }
})
export default Home
