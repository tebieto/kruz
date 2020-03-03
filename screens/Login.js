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
  View, Icon, Picker,} from 'native-base';

  import countryData from '../Countries'
  // Default render of country flag
  const defaultCountry = countryData.filter(
    obj => obj.name === 'Nigeria'
    )[0]

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
  phone_number: yup
    .string()
    .label('')
    .required('This is a required field')
    .min(10, 'Phone number should be minimum of 10 characters')
    .max(10, 'Last 10 digits of your phone number only'),
  username: yup
    .string()
    .label('')
    .required('This is a required field')
});

const saveUser = (data) =>
    setTimeout(() => {
      persistUserData(data);
    }, 1000);

const baseUrl='http://7e39accb.ngrok.io/api/auth'
const persistUserData = ({ username, phone_number, country_code, actions, navigation }) => {
  /*axios.post(baseUrl+'/user', {
    username,
    phone_number,
    country_code
  })
  .then((res)=> {
    alert(JSON.stringify(res))
    actions.setSubmitting(false)
    navigation.navigate('VerifyScreen', { phone_number: `${phone_number}`, id: `${res.data.msg.msg}`, });
  })
  .catch(err=> {
    actions.setSubmitting(false)
    alert(JSON.stringify(err))
    return false
  })
  */
 navigation.navigate('VerifyScreen', { phone_number: `${phone_number}`, })
 actions.setSubmitting(false)
};

class Login extends React.Component { 
  static navigationOptions = {
    title: '',
    headerLeft: () => (
      <Text></Text>
      ),
    headerTitle: () => (
      <Text style={styles.homeLogoText}>KROOOZ</Text>
      )
    };

      state = {
        isbn: '',
        selected: defaultCountry.dial_code,
        flag: defaultCountry.flag
    }
  

    render() {
    const { navigation } = this.props;
    return(
    <SafeAreaView style={styles.container}>
        <Formik
        initialValues={{ username: '', phone_number: '' }}
        onSubmit={(values, actions) => {
            saveUser({ username: values.username, phone_number: values.phone_number, country_code: this.state.selected, actions, navigation })
        }}
        validationSchema={validationSchema}
        >
        {formikProps => (
            <React.Fragment>
            <StyledInput
                label=""
                formikProps={formikProps}
                formikKey="username"
                placeholder='Display Name'
                placeholderTextColor='#adb4bc'
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={false}
                style={styles.nameInput}
            />
            <StyledInput
                label=""
                formikProps={formikProps}
                formikKey="phone_number"
                placeholder='8035827453'
                placeholderTextColor='#adb4bc'
                keyboardType={'phone-pad'}
                returnKeyType='done'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={false}
                autoFocus
                style={styles.textInput}
            />

            <Picker
              mode="dropdown"
              iosHeader="Select Country"
              style={{ width:170, color:'#fff', height: 50, alignSelf: 'center',}}
              selectedValue={this.state.selected}
              onValueChange={(change)=>this.setState(previousState=> ({selected:change}))}
            >
              {countryData.map((item, index)=> (<Picker.Item key={item+''+index} label={item.flag+' '+item.code+'('+item.dial_code+')'} value={item.dial_code} />))}
            </Picker>

            {formikProps.isSubmitting ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <React.Fragment>
                <Button block rounded style={styles.authBtn}  onPress={formikProps.handleSubmit}>
                <Text style={styles.btnText}>Verify Phone Number</Text>
                </Button>
                </React.Fragment>
            )}
            </React.Fragment>
        )}
        </Formik>
    </SafeAreaView>
    );
  }
}

styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a5298',
    display: 'flex',
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 200,
    paddingTop:110
  },
  textInput: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    letterSpacing: 16,
    fontSize: 20
  },
  nameInput: {
    backgroundColor: '#fff',
    paddingLeft: 20,
    fontSize: 20
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
    marginTop:55
  },
  homeLogoText: {
    fontFamily: 'cursive',
    fontSize: 50,
    fontWeight: 'bold',
    marginLeft: 10,
    color:'#fff',
    alignSelf: 'center',
    marginTop: 80
}
  
  
})

export default Login