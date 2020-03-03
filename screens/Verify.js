import React, { Component } from 'react';
import {
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {
  Button, 
  Text,
  View, } from 'native-base';
import {NavigationActions, StackActions} from 'react-navigation';

const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {
  
  const inputStyles = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3,
  };

  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyles.borderColor = 'red';
  }

  return (
    <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
      <Text style={{ marginBottom: 3 }}>{label}</Text>
      <TextInput
        style={inputStyles}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
      <Text style={{ color: '#fff' }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  );
};

const validationSchema = yup.object().shape({
  confirmCode: yup
    .string()
    .label('')
    .required('This is a required field')
});

const baseUrl='http://7e39accb.ngrok.io/api/auth'
const confirmCode = ({ code, actions, navigation }) => {
  /*
  axios.post(baseUrl+'/user/'+navigation.getParam('id')+'/verify', {
    code,
  })
  .then((res)=> {
    alert(JSON.stringify(res))
    authenticateUser({ code, actions, navigation })
  })
  .catch(err=> {
    actions.setSubmitting(false)
    alert(JSON.stringify(err))
    return false
  })
  */

 const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'HomeScreen'})],
  key: null,
});
navigation.dispatch(resetAction);
};

const authenticateUser = ({ code, actions, navigation }) => {
  axios.post(baseUrl+'/authenticate', {
    phone_number: navigation.getParam('phoneNumber'),
  })
  .then((res)=> {
    actions.setSubmitting(false)
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'HomeScreen'})],
      key: null,
    });
    navigation.dispatch(resetAction);
  })
  .catch(err=> {
    actions.setSubmitting(false)
    alert(JSON.stringify(err))
    return false
  })
};

class Verify extends Component { 
static navigationOptions = {
    title: '',
    };
    
    state = {
        isbn: '',
    }

    render() {
    const { navigation } = this.props;
    return(
    <SafeAreaView style={verifyStyles.container}>
        <Text style={verifyStyles.authLogo}>KROOOZ</Text>
        <Formik
        initialValues={{ confirmCode: '' }}
        onSubmit={(values, actions) => {
            confirmCode({ code: values.confirmCode, actions, navigation })
        }}
        validationSchema={validationSchema}
        >
        {formikProps => (
            <React.Fragment>
            <StyledInput
                label=""
                formikProps={formikProps}
                formikKey="confirmCode"
                placeholder='00000'
                placeholderTextColor='#adb4bc'
                keyboardType={'phone-pad'}
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={false}
                autoFocus
                style={verifyStyles.textInput}
            />

            {formikProps.isSubmitting ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <React.Fragment>
                <Button block rounded style={verifyStyles.authBtn}  onPress={formikProps.handleSubmit}>
                <Text style={verifyStyles.btnText}>Confirm Code</Text>
                </Button>
                </React.Fragment>
            )}
            </React.Fragment>
        )}
        </Formik>
        
        <Text style={verifyStyles.note}>Code was sent to {navigation.getParam('phoneNumber')}</Text>
        <Text style={verifyStyles.underline}>Resend Code</Text>
    </SafeAreaView>
    );
  }
}

verifyStyles = StyleSheet.create({
  container: {
    backgroundColor: '#2a5298',
    display: 'flex',
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 200
  },
  textInput: {
    backgroundColor: '#fff',
    fontWeight:'bold',
    paddingLeft: 20,
    letterSpacing:46
  },
  authBtn: {
    backgroundColor: '#fff',
    fontWeight:'bold',
    color: 'black',
    width: 200,
    alignSelf: 'center',
    marginTop: 10
  },
  btnText: {
    color: '#2a5298',
  },
  authLogo: {
    fontSize: 50,
    color: '#fff',
    alignSelf: 'center',
    fontFamily: 'cursive',
    fontWeight: 'bold',
    marginTop:50
  },
  note: {
    alignSelf: 'center',
    marginTop: 10,
    color: '#fff'
  },
  underline: {
    alignSelf: 'center',
    marginTop: 10,
    color: '#fff',
    textDecorationLine: 'underline'
  }
  
  
})

export default Verify