import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, { useState } from 'react';
  import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
  import CustomTextInput from '../../components/CustomTextInput';
  import CustomSolidBtn from '../../components/CustomSolidBtn';
  import CustomBorderBtn from '../../components/CustomBorderBtn';
  import { useNavigation } from '@react-navigation/native';
  import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome for icons
  
  const Login = () => {
    const navigation = useNavigation();
  
    const [form, setForm] = useState({
      email: '',
      password: '',
    });
  
    const [errors, setErrors] = useState({
      email: '',
      password: '',
    });
  
    const handleChange = (field, value) => {
      setForm({
        ...form,
        [field]: value,
      });
    };
  
    const validate = () => {
      let valid = true;
      const newErrors = { email: '', password: '' };
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = form.email?.trim() || '';
      if (trimmedEmail === '') {
        newErrors.email = 'Please enter an email';
        valid = false;
      } else if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email';
        valid = false;
      }
  
      if (form.password === '') {
        newErrors.password = 'Please enter a password';
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../../images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>
  
        <CustomTextInput
          value={form.email}
          onChangeText={txt => handleChange('email', txt)}
          title={"Email"}
          placeholder={'xyz@gmail.com'}
          bad={errors.email !== ''}
        />
        {errors.email !== '' && <Text style={styles.errorMsg}>{errors.email}</Text>}
  
        <CustomTextInput
          value={form.password}
          onChangeText={txt => handleChange('password', txt)}
          title={'Password'}
          placeholder={'********'}
          secureTextEntry={true}
          bad={errors.password !== ''}
        />
        {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}
  
        <Text style={styles.forgot}>Forgot password?</Text>
  
        <View style={styles.buttonContainer}>
          <CustomSolidBtn
            title={'Login'}
            onClick={() => {
              if (validate()) {
                console.log("Login validated successfully");
                // Proceed with login logic
              }
            }}
          />
  
          <CustomBorderBtn
            onClick={() => navigation.navigate('Signup')}
            title={'Create Account'}
          />
        </View>

        {/* Social Auth Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              // Add Google sign-in logic here
              console.log("Google sign-in");
            }}
          >
            <Icon name="google" size={scale(24)} color="#DD4B39" />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => {
              // Add Facebook sign-in logic here
              console.log("Facebook sign-in");
            }}
          >
            <Icon name="facebook" size={scale(24)} color="#3b5998" />
            <Text style={styles.socialButtonText}>Sign in with Facebook</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default Login;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: moderateScale(20),
    },
    logo: {
      width: scale(100),
      height: scale(100),
      alignSelf: 'center',
      marginTop: moderateVerticalScale(40),
      borderRadius: 9,
    },
    title: {
      fontWeight: '600',
      marginTop: moderateVerticalScale(50),
      alignSelf: 'center',
      fontSize: 25,
    },
    forgot: {
      marginTop: moderateVerticalScale(10),
      alignSelf: 'flex-end',
      fontSize: moderateScale(14),
      marginRight: moderateScale(20),
      fontWeight: '600',
    },
    errorMsg: {
      alignSelf: "flex-start",
      marginLeft: moderateScale(25),
      color: "red",
      marginBottom: moderateVerticalScale(5),
    },
    buttonContainer: {
      marginTop: moderateVerticalScale(30),
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialButtonsContainer: {
      marginTop: moderateVerticalScale(20),
      width: '100%',
      alignItems: 'center',
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      paddingVertical: moderateVerticalScale(10),
      paddingHorizontal: moderateScale(20),
      borderRadius: 5,
      marginBottom: moderateVerticalScale(10),
      width: '80%',
      justifyContent: 'center',
    },
    socialButtonText: {
      marginLeft: moderateScale(10),
      fontSize: 16,
    },
  });
  