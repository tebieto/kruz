import React, {Component} from 'react'
import { GiftedChat, Send, Message } from "react-native-gifted-chat";
import {
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    StyleSheet
  } from 'react-native';

export default class Chat extends Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
          headerTitle: params.title,
        };
      };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.user_id = 1;
        this.user_name = 'Terry Ebieto'
      }

    state = {
        is_initialized: false
    }
    
    componentDidMount() {
        this.runTest()
        this.setState({
            is_initialized: true
        })
    }

    async runTest() {
        const data = {
            id: 'dmdkdmdmdm,d',
            sender: {id: 2, name: 'Terry Ebieto', },
            text: 'How are you',
            createdAt: new Date()
        }
        const { message } = await this.getMessage(data);
        await this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, message)
        }));
    }

    getMessage = async ({ id, sender, text, createdAt }) => {
    
        const msg_data = {
          _id: id,
          text,
          createdAt: new Date(createdAt),
          user: {
            _id: sender.id,
            name: sender.name,
            avatar: `https://ui-avatars.com/api/?background=2a5298&color=FFF&name=${sender.name}`
          }
        };
        return {
          message: msg_data
        };
      }

      async sendUserMessage([{text}]) {
        const data = {
            id: null,
            sender: {id: this.user_id, name:this.user_name },
            text,
            createdAt: new Date()
        }
        const { message } = await this.getMessage(data);
        await this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, message)
        }));
      }
    
    render() {
        const {
        is_initialized,
        messages
        } = this.state;

        return (
         <SafeAreaView style={styleChat.container}>
            {(!is_initialized) && (
            <ActivityIndicator
                size="small"
                color="#0064e1"
                style={styles.loader}
            />
            )}

            {is_initialized && (
            <GiftedChat
                messages={messages}
                user={{
                    _id: this.user_id
                  }}
                onSend={messages => this.sendUserMessage(messages)}
                loadEarlier
            />
            )}
        </SafeAreaView>
        );
    }
}

styleChat = StyleSheet.create({
    container: {
        flex: 1
    },
});