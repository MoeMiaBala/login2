import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters';
import CustomTextInput from '../../components/CustomTextInput';
import CustomSolidBtn from '../../components/CustomSolidBtn';
import CustomBorderBtn from '../../components/CustomBorderBtn';
import CustomPasswordInput from '../../components/CustomPasswordInput';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome for icons
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../../../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, linkWithPopup, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { fetchUserdata } from '../../utils/dbActions';

const Login = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', forgot: '' });

  WebBrowser.maybeCompleteAuthSession();
  // Google Auth State
  const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: "508968229017-oph0d8vps86gnkjnkcaengojn06nu2j5.apps.googleusercontent.com",
      iosClientId: "508968229017-4h614sqcon9ihe9bk7fibi3ovt42ua30.apps.googleusercontent.com",
      webClientId: "508968229017-ttmop4i18bki8tv08peau944lhbgq3qc.apps.googleusercontent.com",
      scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response) {
        console.log("Google Sign-In Response:", response); // Log the entire response for debugging

        if (response.type === 'success') {
            const { access_token } = response.params; // Extract access_token from params

            // Check if access_token is available
            if (access_token) {
                // Fetch user info using access_token
                fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
                    .then((res) => {
                        if (!res.ok) {
                            throw new Error('Failed to fetch user info'); // Handle error if response is not ok
                        }
                        return res.json();
                    })
                    .then(async (userInfo) => {
                      const credential = GoogleAuthProvider.credential(null, access_token);
                      const signInResult = await signInWithCredential(auth, credential);
                      console.log("the user that is signing in rn:  ", signInResult.user.uid)
                      // Check if the user already exists in your database
                      const userData = await fetchUserdata(signInResult.user);
                      
                      if (userData) {
                          navigation.navigate(userData.role === 'Employer' ? 'EmployerDashboard' : 'JobSearching', { uid: signInResult.user.uid });
                      } else {
                          // User not found, allow them to create an account or link
                          Alert.alert('Account not found', 'You can create a new account or link your Google account.');
                      }
                    })
                    .catch((error) => {
                        console.error('Error fetching user info:', error);
                        Alert.alert('User Info Fetch Error', error.message); // Alert the user about the error
                    });
            } else {
                console.error('Access token not found in response');
                Alert.alert('Sign-In Error', 'Access token not found.'); // Notify the user about the error
            }
        } else {
            console.warn('Sign-in failed or was canceled', response);
            Alert.alert('Sign-In Error', 'Sign-in failed or was canceled.'); // Notify the user
        }
    }
  }, [response]);

  const linkGoogleAccount = async (user) => {
    const provider = new GoogleAuthProvider();
    try {
        await linkWithPopup(user, provider);
        console.log('Google account linked:', user);
    } catch (error) {
        console.error('Error linking Google account:', error);
        Alert.alert('Linking Error', error.message);
    }
  };
  
  const handleChange = (field, value) => {
      setForm({ ...form, [field]: value });
  };

  const sendPasswordReset = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      const newErrors = { email: '' };
      const trimmedEmail = email?.trim() || '';
      if (trimmedEmail === '') {
          newErrors.email = 'Please enter an email';
      } else if (!emailRegex.test(trimmedEmail)) {
          newErrors.email = 'Please enter a valid email';
      }
      setErrors(newErrors);
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      console.error('Error sending password reset email:', error);
      //Alert.alert('Reset Error', error.message);
    }
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

  const handleLogin = () => {
    if (validate()) {
      signInWithEmailAndPassword(auth, form.email.trim(), form.password)
        .then(async (userCredential) => {
          const { uid } = userCredential.user;
          console.log("login user       ",uid);
          
          const userData = await fetchUserdata(userCredential.user);
  
          if (userData && userData.role) {
            // Check the role field and navigate accordingly
            if (userData.role === 'Employer') {
              navigation.navigate('EmployerDashboard', { uid }); // Navigate to employer dashboard
            } else if (userData.role === 'Applicant') {
              navigation.navigate('JobSearching', { uid }); // Navigate to job searching page
            } else {
              console.error('Unknown user role:', userData.role);
            }
          } else {
            console.error('Role not found or user data invalid');
          }
        })
        .catch(async (error) => {
          if (error.code === 'auth/user-not-found') {
              // User not found, notify or handle linking with Google
              Alert.alert('User not found', 'Please check your email or sign in with Google.');
          } else {
              console.error('Error during login:', error);
              Alert.alert('Login Error', error.message);
          }
      });
    }
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
  
            <CustomPasswordInput
              value={form.password}
              onChangeText={txt => handleChange('password', txt)}
              title={'Password'}
              placeholder={'********'}
              secureTextEntry={true}
              bad={errors.password !== ''}
            />            
            {errors.password !== '' && <Text style={styles.errorMsg}>{errors.password}</Text>}
  
            <TouchableOpacity onPress={() => sendPasswordReset(form.email.trim())}>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
  
            <View style={styles.buttonContainer}>
                <CustomSolidBtn
                    title={'Login'}
                    onClick={handleLogin}
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
                    onPress={() => promptAsync()}
                >
                    <Icon name="google" size={24} color="#DD4B39" />
                    <Text style={styles.socialButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => {
                        // Add Facebook sign-in logic here
                        
                    }}
                >
                    <Icon name="facebook" size={24} color="#3b5998" />
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
      fontWeight: '600',                      // Make it bolder
      color: '#000',                       // Add a standout color (customize to your theme)
      textDecorationLine: 'underline', 
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
  