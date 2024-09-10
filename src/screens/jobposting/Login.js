import { View, Text , StyleSheet,SafeAreaView, Image} from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale,scale } from 'react-native-size-matters'
import CustomTextInput from '../../components/CustomTextInput'
import CustomSolidBtn from '../../components/CustomSolidBtn'
import CustomBorderBtn from '../../components/CustomBorderBtn'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const navigation=useNavigation();
  return (
    <SafeAreaView style={styles.container}>
        <Image 
        source={require('../../images/logo.png')}
        style={styles.logo} 
        />
        <Text style={styles.title}>Login</Text>

        <CustomTextInput title={"Email"} placeholder={'xyz@gmail.com'}/>
        <CustomTextInput title={'Password'} placeholder={'********'}/>
        <Text style={styles.forgot}>Forgot password? </Text>
        <CustomSolidBtn title={'Login'} onClick={() => {
            
        }}/>
        <CustomBorderBtn onClick={() =>
        navigation.navigate('Signup')  // navigate to register
        }
        title={'Create Account'}/>
        
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
    },
    logo:{
        width: scale(100),
        height: scale(100),
        alignSelf: 'center',
        marginTop:moderateVerticalScale(40)
    },
    title:{
    
        fontWeight: '600',
        marginTop: moderateVerticalScale(50),
        alignSelf: 'center',
        fontSize: 25
    },
    forgot:{
        marginTop: moderateVerticalScale(10),
        alignSelf: 'flex-end',
        fontSize: moderateScale(14),
        marginRight:moderateScale(20),
        fontWeight: '600',
    }
})