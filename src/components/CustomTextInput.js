import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import { moderateScale, moderateVerticalScale, verticalScale } from 'react-native-size-matters'
import { TextInput } from 'react-native-gesture-handler'

const CustomTextInput = ({title,placeholder, value, onChangeText}) => {
  return (
    <View style={styles.input}>
        <Text style={styles.title}>{title}</Text>
        <TextInput 
        placeholder={placeholder} 
        value={value} 
        onChange={txt=>{onChangeText(txt)}}
        />
    </View>
  )
}

export default CustomTextInput;

const styles= StyleSheet.create({
    input:{
        width:"90%",
        height:verticalScale(50),
        borderWidth:0.4,
        alignSelf:"center",
        marginTop:moderateVerticalScale(20),
        borderRadius:moderateScale(10),
        justifyContent: "center",
    },
    title:{
        alignSelf:'flex-start',
        marginLeft:moderateScale(20),
        top:-moderateVerticalScale(8),
        position:'absolute',
        paddingLeft:moderateScale(10),
        paddingRight:moderateScale(10),
        backgroundColor:'white',
    }
})