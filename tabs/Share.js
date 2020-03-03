import React, { Component } from 'react';
import { Container, Card,CardItem, Text, View, Button, Icon, Fab } from 'native-base';
export default class FABExample extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    };
  }
  render() {
    return (  
      <Container padder>
        <Card transparent>
            <CardItem>
              <Text style={{fontFamily: 'courier', fontSize:20}}>When you share your Kroooz link with friends, you will receive messages from them. But their identity will be kept anonymous. Click the share button below to continue.</Text>
             </CardItem>
           </Card>
        <View style={{ flex: 1 }}>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="share" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button disabled style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}