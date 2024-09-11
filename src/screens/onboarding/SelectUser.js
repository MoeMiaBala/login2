import { View, Text, StyleSheet ,Image} from 'react-native'
import React from 'react'
import { moderateScale, verticalScale, moderateVerticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const SelectUser = () => {
    const navigation = useNavigation()
  return (
    <View style={styles.container}>
        <Image 
        source={require('../../images/logo.png')} 
        style={styles.logo}
        />
      <Text style={styles.title}>Looking forward to: </Text>
      <TouchableOpacity style={styles.hire}
      onPress={() =>{
        navigation.navigate('JobPostingNav')
      }}
      >
        <Text style={styles.btnTxt1}> Hiring candidate  </Text>

      </TouchableOpacity>

      <TouchableOpacity style={styles.post}>
        <Text style={styles.btnTxt2}>     Finding a job   </Text>

      </TouchableOpacity>
    </View>
  )
}

export default SelectUser
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight:'600'
    },
    hire: {
        width:'90%',
        height: verticalScale(45),
        backgroundColor: 'black',
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateVerticalScale(20)
    },
    btnTxt1:{
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight:'500'
    },
    post: {
        width:'90%',
        height: verticalScale(45),
        borderColor: 'black',
        borderWidth:1,
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateVerticalScale(20)
    },
    btnTxt2:{
        color: 'black',
        fontSize: moderateScale(16),
        fontWeight:'500'
    },
    logo: {
        width: moderateScale(250),
        height: moderateScale(250),
        resizeMode: 'contain',
        marginBottom: moderateVerticalScale(20),
        borderRadius: 9,
    }
})